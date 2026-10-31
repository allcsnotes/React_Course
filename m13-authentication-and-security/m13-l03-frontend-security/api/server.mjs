// The practice A P I (module 13, lesson 3). A stand-in for the allcsvideos server, with a request log.
//   GET  /api/reviews                   -> the reviews of one course
//   POST /api/reviews                   -> add a review { author, text }
//   POST /api/login                     -> sets the session cookie (SameSite from /mode)
//   POST /api/enrollments/cancel        -> cancels the logged-in student's enrolment (needs the cookie)
//   GET  /api/steal?t=...               -> pretend attacker server: only logs what it receives
//   POST /mode?samesite=None|Lax        -> practice switch for the cookie attribute
//   POST /reset   GET /log
import http from 'node:http'

const START = [{ author: 'Lukas', text: 'Clear and calm. The hooks lesson finally made sense.' }, { author: 'Priya', text: 'Great pace, and the practice sheets are fun.' }, { author: 'Meera', text: 'Thank you all! <b>Keep practising every day.</b>' }]
let reviews, log, mode = 'Lax', enrolled = true
const reset = () => { reviews = START.map(r => ({ ...r })); log = []; mode = 'Lax'; enrolled = true }
reset()
const PAGE = b => `<style>body{margin:0;min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;font:30px system-ui;background:#fff;color:#1c2430}h1{font-size:60px;margin:0 0 12px}p{margin:0}</style>${b}`
const body = req => new Promise(ok => { let d = ''; req.on('data', c => d += c); req.on('end', () => ok(d)) })

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost'), p = url.pathname
  const send = (code, b, type = 'application/json', h = {}) => { res.writeHead(code, { 'content-type': type, ...h }); res.end(typeof b === 'string' ? b : JSON.stringify(b)) }
  const sid = (req.headers.cookie || '').includes('sid=asha-session')
  if (p === '/log') return send(200, log.map(l => l + '\n').join(''), 'text/plain')
  if (p === '/reset') { reset(); return send(200, { ok: true }) }
  if (p === '/mode') { mode = url.searchParams.get('samesite') === 'None' ? 'None' : 'Lax'; return send(200, { samesite: mode }) }
  if (p === '/state') return send(200, { enrolled, mode })
  if (p.startsWith('/api/')) log.push(`${req.method} ${p}${p === '/api/steal' ? ' ' + url.searchParams.toString() : ''}`)
  if (p === '/api/reviews' && req.method === 'GET') return send(200, reviews)
  if (p === '/api/reviews' && req.method === 'POST') { const r = JSON.parse(await body(req)); reviews.push({ author: String(r.author), text: String(r.text) }); return send(201, { ok: true, count: reviews.length }) }
  if (p === '/api/steal') return send(200, { ok: true })
  if (p === '/api/login' && req.method === 'POST') {
    const attrs = mode === 'None' ? 'SameSite=None; Secure' : 'SameSite=Lax'
    return send(200, { user: 'asha', role: 'student' }, 'application/json', { 'set-cookie': `sid=asha-session; HttpOnly; Path=/; ${attrs}` }) }
  if (p === '/api/enrollments/cancel' && req.method === 'POST') {
    log.push(`  cookie: ${sid ? 'sent (asha)' : 'not sent'}`)
    if (!sid) return send(401, PAGE('<h1>401</h1><p>Please log in first.</p>'), 'text/html')
    enrolled = false; log.push('  -> enrolment cancelled for asha'); return send(200, PAGE('<h1>Done</h1><p>Your enrolment was cancelled.</p>'), 'text/html') }
  send(404, { error: 'not found' })
}).listen(8133, () => console.log('API on http://localhost:8133'))
