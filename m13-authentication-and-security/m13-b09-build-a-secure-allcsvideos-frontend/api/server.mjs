// The practice A P I for the secure allcsvideos frontend (module 13, build 9). Everything here is a local practice demo.
//   POST  /api/auth/signup   {name,email,password}  -> 201 {accessToken,user} + refresh cookie   (role is ALWAYS student)
//   POST  /api/auth/login    {email,password}       -> 200 {accessToken,user} + refresh cookie
//   POST  /api/auth/refresh  (cookie only)          -> 200 {accessToken,user} + a NEW refresh cookie (rotation)
//   POST  /api/auth/logout                          -> 204, cookie cleared
//   GET   /api/me/courses                           -> any signed-in user
//   GET   /api/instructor/courses, POST  /api/instructor/courses {title}   -> instructor or admin
//   GET   /api/admin/users, PATCH /api/admin/users/:id {role}              -> admin only
//   POST  /api/reset                                -> starting data (for the video's tests)
// The access token lives only ACCESS_SECONDS (access-seconds.txt, 8 s for the video; real servers use about 15 minutes).
// The refresh token is a random string kept on the server, sent only as an httpOnly cookie, and rotated on every use.
import http from 'node:http'
import fs from 'node:fs'
import crypto from 'node:crypto'

const SECRET = crypto.randomBytes(32)
const PORT = Number(process.env.PORT || 8139)
const accessSeconds = () => Number(fs.readFileSync(new URL('./access-seconds.txt', import.meta.url), 'utf8').trim() || 8)
const refreshDelay = () => Number(fs.existsSync(new URL('./refresh-delay.txt', import.meta.url)) ? fs.readFileSync(new URL('./refresh-delay.txt', import.meta.url), 'utf8').trim() || 0 : 0)
const b64 = b => Buffer.from(b).toString('base64url')
const hash = (pw, salt = crypto.randomBytes(8).toString('hex')) => salt + ':' + crypto.scryptSync(pw, salt, 32).toString('hex')
const check = (pw, h) => { const [salt] = h.split(':'); return crypto.timingSafeEqual(Buffer.from(hash(pw, salt)), Buffer.from(h)) }
const sign = u => { const head = b64(JSON.stringify({ alg: 'HS256', typ: 'JWT' })), body = b64(JSON.stringify({ sub: u.id, role: u.role, exp: Math.floor(Date.now() / 1000) + accessSeconds() }))
  return head + '.' + body + '.' + crypto.createHmac('sha256', SECRET).update(head + '.' + body).digest('base64url') }
const verify = tok => { const [h, b, s] = String(tok).split('.'); if (!s || crypto.createHmac('sha256', SECRET).update(h + '.' + b).digest('base64url') !== s) return null
  const p = JSON.parse(Buffer.from(b, 'base64url').toString()); return p }

const START_USERS = () => [
  { id: 1, name: 'Lukas', email: 'lukas@example.com', role: 'student', pw: hash('learn-fast-42') },
  { id: 2, name: 'Meera', email: 'meera@example.com', role: 'instructor', pw: hash('teach-well-77') },
  { id: 3, name: 'Asha', email: 'asha@example.com', role: 'admin', pw: hash('admin-only-99') },
]
const START_COURSES = () => [
  { slug: 'react-for-beginners', title: 'React for Beginners', teacher: 'Meera', lessonCount: 4, completedCount: 2 },
  { slug: 'python-from-zero', title: 'Python from Zero', teacher: 'Meera', lessonCount: 3, completedCount: 3 },
  { slug: 'sql-in-two-weeks', title: 'SQL in Two Weeks', teacher: 'Asha', lessonCount: 3, completedCount: 1 },
]
let USERS = START_USERS(), COURSES = START_COURSES(), REFRESH = new Map(), NEXT = 4
const pub = u => ({ id: u.id, name: u.name, email: u.email, role: u.role })
const t0 = Date.now()
const stamp = () => '+' + ((Date.now() - t0) / 1000).toFixed(1).padStart(5, ' ') + 's'

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost'), started = Date.now()
  let body = ''
  req.on('data', c => body += c)
  req.on('end', () => {
    const cookie = Object.fromEntries((req.headers.cookie || '').split(/;\s*/).filter(Boolean).map(c => c.split('=')))
    let who = null, why = ''
    const send = (code, obj, headers = {}, note = '') => { setTimeout(() => {
      console.log(`${stamp()} ${req.method.padEnd(5)} ${url.pathname.padEnd(24)} ${code}${note || why ? '  ' + (note || why) : ''}`)
      res.writeHead(code, { 'content-type': 'application/json', ...headers }); res.end(code === 204 ? '' : JSON.stringify(obj)) }, Math.max(0, 150 - (Date.now() - started))) }
    const setCookie = v => `refresh=${v}; HttpOnly; SameSite=Strict; Path=/api/auth; Max-Age=${v ? 604800 : 0}`
    const json = () => { try { return JSON.parse(body || '{}') } catch { return {} } }
    const issue = (u, code) => { const r = crypto.randomBytes(24).toString('hex'); REFRESH.set(r, { id: u.id, used: false })
      send(code, { accessToken: sign(u), user: pub(u) }, { 'set-cookie': setCookie(r) }) }
    const auth = () => { const h = req.headers.authorization || ''; if (!h.startsWith('Bearer ')) { why = 'no token'; return null }
      const p = verify(h.slice(7)); if (!p) { why = 'bad token'; return null }
      if (p.exp < Date.now() / 1000) { why = 'token expired'; return null }
      return USERS.find(u => u.id === p.sub) || null }
    const need = (roles) => { who = auth(); if (!who) { send(401, { error: why === 'token expired' ? 'Token expired' : 'Not signed in' }); return false }
      if (roles && !roles.includes(who.role)) { why = `role ${who.role} is not allowed`; send(403, { error: 'You are not allowed to do that' }); return false } return true }
    const route = `${req.method} ${url.pathname}`

    if (route === 'POST /api/reset') { USERS = START_USERS(); COURSES = START_COURSES(); REFRESH = new Map(); NEXT = 4; return send(200, { ok: true }) }
    if (route === 'POST /api/auth/signup') {
      const b = json(), fields = {}
      if (!b.name || String(b.name).trim().length < 2) fields.name = 'Name needs at least 2 letters'
      if (!/^\S+@\S+\.\S+$/.test(b.email || '')) fields.email = 'Enter a real email address'
      if (!b.password || String(b.password).length < 8) fields.password = 'Password needs at least 8 characters'
      if (Object.keys(fields).length) return send(400, { error: 'Please fix the form', fields })
      if (USERS.some(u => u.email === String(b.email).toLowerCase())) return send(409, { error: 'That email already has an account', fields: { email: 'That email already has an account' } })
      const u = { id: NEXT++, name: String(b.name).trim(), email: String(b.email).toLowerCase(), role: 'student', pw: hash(String(b.password)) }   // a role sent by the client is ignored
      USERS.push(u); return issue(u, 201) }
    if (route === 'POST /api/auth/login') {
      const b = json(), u = USERS.find(x => x.email === String(b.email || '').toLowerCase())
      if (!u || !check(String(b.password || ''), u.pw)) return send(401, { error: 'Wrong email or password' })
      return issue(u, 200) }
    if (route === 'POST /api/auth/refresh') {
      return setTimeout(() => {
        const rec = REFRESH.get(cookie.refresh)
        if (!cookie.refresh) { why = 'no cookie'; return send(401, { error: 'No refresh cookie' }) }
        if (!rec) { why = 'unknown refresh token'; return send(401, { error: 'Session ended' }, { 'set-cookie': setCookie('') }) }
        if (rec.used) { for (const [k, v] of REFRESH) if (v.id === rec.id) REFRESH.delete(k); why = 'REUSED refresh token: all sessions of this user ended'; return send(401, { error: 'Session ended' }, { 'set-cookie': setCookie('') }) }
        rec.used = true; const u = USERS.find(x => x.id === rec.id); issue(u, 200) }, refreshDelay()) }
    if (route === 'POST /api/auth/logout') { REFRESH.delete(cookie.refresh); return send(204, null, { 'set-cookie': setCookie('') }) }
    if (route === 'GET /api/me/courses') { if (!need()) return; return send(200, COURSES) }
    if (route === 'GET /api/instructor/courses') { if (!need(['instructor', 'admin'])) return; return send(200, COURSES.filter(c => who.role === 'admin' || c.teacher === who.name)) }
    if (route === 'POST /api/instructor/courses') { if (!need(['instructor', 'admin'])) return; const b = json()
      if (!b.title || String(b.title).trim().length < 3) return send(400, { error: 'Title needs at least 3 letters' })
      const c = { slug: String(b.title).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'), title: String(b.title).trim(), teacher: who.name, lessonCount: 0, completedCount: 0 }
      COURSES.push(c); return send(201, c) }
    if (route === 'GET /api/admin/users') { if (!need(['admin'])) return; return send(200, USERS.map(pub)) }
    let m = url.pathname.match(/^\/api\/admin\/users\/(\d+)$/)
    if (req.method === 'PATCH' && m) { if (!need(['admin'])) return; const u = USERS.find(x => x.id === Number(m[1])), b = json()
      if (!u) return send(404, { error: 'No such user' })
      if (!['student', 'instructor', 'admin'].includes(b.role)) return send(400, { error: 'Unknown role' })
      u.role = b.role; return send(200, pub(u)) }
    send(404, { error: 'not found' })
  })
}).listen(PORT, () => console.log(`Practice API on http://localhost:${PORT} (access token lives ${accessSeconds()} s)`))
