// The practice A P I for module 13 (local only, never real accounts). Two ways to log in:
//   session: POST /api/session/login -> Set-Cookie sid (HttpOnly) ; GET /api/session/me ; POST /api/session/logout
//   token:   POST /api/login -> { accessToken } (a JWT, 10 s life) + refresh cookie rt (HttpOnly) ; GET /api/me (Bearer) ; POST /api/refresh ; POST /api/logout
//   GET /api/my-courses needs a Bearer token.  mode.txt: same (no CORS) | cors (credentials allowed for localhost:5231) | wild (Allow-Origin *)
import http from 'node:http'
import fs from 'node:fs'
import crypto from 'node:crypto'

const PORT = 8131, ORIGIN = 'http://localhost:5231'
const SECRET = 'practice-secret-do-not-reuse-0123456789'
const ACCESS_SECONDS = Number(process.env.ACCESS_SECONDS || 10)
const USERS = [
  { id: 1, email: 'lukas@example.com', password: 'pass1234', name: 'Lukas', role: 'student' },
  { id: 2, email: 'meera@example.com', password: 'pass1234', name: 'Meera', role: 'instructor' },
]
const COURSES = ['React for Beginners', 'Python from Zero', 'SQL in Two Weeks']
const sessions = new Map()       // sid -> user id   (the notebook)
const refreshTokens = new Map()  // rt  -> { userId, revoked }

const b64 = o => Buffer.from(typeof o === 'string' ? o : JSON.stringify(o)).toString('base64url')
const sign = data => crypto.createHmac('sha256', SECRET).update(data).digest('base64url')
const makeJwt = u => { const now = Math.floor(Date.now() / 1000), h = b64({ alg: 'HS256', typ: 'JWT' }), p = b64({ sub: String(u.id), name: u.name, role: u.role, iat: now, exp: now + ACCESS_SECONDS }); return `${h}.${p}.${sign(h + '.' + p)}` }
function checkJwt(token) {
  const [h, p, s] = token.split('.'); if (!h || !p || !s || sign(h + '.' + p) !== s) return { error: 'invalid token' }
  const payload = JSON.parse(Buffer.from(p, 'base64url')); if (payload.exp < Date.now() / 1000) return { error: 'token expired' }
  return { payload } }
const cookies = req => Object.fromEntries((req.headers.cookie || '').split(';').filter(Boolean).map(c => { const i = c.indexOf('='); return [c.slice(0, i).trim(), c.slice(i + 1).trim()] }))
const body = req => new Promise(r => { let d = ''; req.on('data', c => d += c); req.on('end', () => { try { r(JSON.parse(d || '{}')) } catch { r({}) } }) })

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost'), mode = fs.readFileSync(new URL('./mode.txt', import.meta.url), 'utf8').trim()
  const cors = {}
  if (mode === 'cors' && req.headers.origin === ORIGIN) Object.assign(cors, { 'access-control-allow-origin': ORIGIN, 'access-control-allow-credentials': 'true', 'access-control-allow-headers': 'content-type, authorization' })
  if (mode === 'wild') Object.assign(cors, { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type, authorization' })
  if (req.method === 'OPTIONS') { res.writeHead(204, cors); return res.end() }
  const delay = url.pathname === '/api/refresh' ? 400 : 150   // a refresh takes a little longer: it writes to the database
  const send = (code, obj, extra = {}) => setTimeout(() => { res.writeHead(code, { 'Content-Type': 'application/json', ...cors, ...extra }); res.end(JSON.stringify(obj)) }, delay)
  const ck = cookies(req), path = url.pathname, who = id => USERS.find(u => u.id === id)
  if (process.env.LOG) console.log(Date.now() % 100000, req.method, path, (ck.rt || '').slice(0, 6))
  const bearer = () => { const a = req.headers.authorization || ''; if (!a.startsWith('Bearer ')) return { error: 'not authenticated' }; return checkJwt(a.slice(7)) }
  const newRefresh = userId => { const rt = crypto.randomBytes(24).toString('base64url'); refreshTokens.set(rt, { userId, revoked: false }); return `rt=${rt}; Path=/api; HttpOnly; SameSite=Lax; Max-Age=604800` }

  if (path === '/api/session/login' && req.method === 'POST') {
    const { email, password } = await body(req), u = USERS.find(x => x.email === email && x.password === password)
    if (!u) return send(401, { detail: 'wrong email or password' })
    const sid = crypto.randomBytes(16).toString('hex'); sessions.set(sid, u.id)
    return send(200, { name: u.name, role: u.role }, { 'Set-Cookie': `sid=${sid}; Path=/; HttpOnly; SameSite=Lax` }) }
  if (path === '/api/session/me') { const id = sessions.get(ck.sid); return id ? send(200, { name: who(id).name, role: who(id).role }) : send(401, { detail: 'not logged in' }) }
  if (path === '/api/session/my-courses') { const id = sessions.get(ck.sid); return id ? send(200, COURSES.map((title, i) => ({ id: i + 1, title }))) : send(401, { detail: 'not logged in' }) }
  if (path === '/api/session/logout' && req.method === 'POST') { sessions.delete(ck.sid); return send(200, { ok: true }, { 'Set-Cookie': 'sid=; Path=/; HttpOnly; Max-Age=0' }) }

  if (path === '/api/login' && req.method === 'POST') {
    const { email, password } = await body(req), u = USERS.find(x => x.email === email && x.password === password)
    if (!u) return send(401, { detail: 'wrong email or password' })
    return send(200, { accessToken: makeJwt(u), tokenType: 'bearer' }, { 'Set-Cookie': newRefresh(u.id) }) }
  if (path === '/api/me') { const r = bearer(); return r.error ? send(401, { detail: r.error }) : send(200, { name: r.payload.name, role: r.payload.role }) }
  if (path === '/api/my-courses') { const r = bearer(); return r.error ? send(401, { detail: r.error }) : send(200, COURSES.map((title, i) => ({ id: i + 1, title }))) }
  if (path === '/api/refresh' && req.method === 'POST') {
    const row = refreshTokens.get(ck.rt); if (!row || row.revoked) return send(401, { detail: 'refresh token not valid' })
    row.revoked = true; const u = who(row.userId)
    return send(200, { accessToken: makeJwt(u), tokenType: 'bearer' }, { 'Set-Cookie': newRefresh(u.id) }) }
  if (path === '/api/logout' && req.method === 'POST') { const row = refreshTokens.get(ck.rt); if (row) row.revoked = true; return send(200, { ok: true }, { 'Set-Cookie': 'rt=; Path=/api; HttpOnly; Max-Age=0' }) }
  send(404, { detail: 'not found' })
}).listen(PORT, () => console.log('practice A P I on http://localhost:' + PORT))
