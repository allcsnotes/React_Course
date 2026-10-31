// A small stand-in for the allcsvideos API (module 14, lesson 4): "the practice API". Not the production server.
//   mode.txt = ok   -> joining the waitlist works
//   mode.txt = fail -> joining always fails with 500 (the mail service is down)
//   GET  /api/courses   -> the list of courses                                  (takes 1200 ms)
//   GET  /api/waitlist  -> the emails already on the waitlist
//   POST /api/waitlist  -> body {"email": "..."}; adds it to the waitlist       (takes 1500 ms)
//   POST /api/reset     -> empty the waitlist (used between recordings)
// Every request prints one log line: METHOD PATH STATUS DURATION.
import http from 'node:http'
import fs from 'node:fs'

const COURSES = [
  { slug: 'react-for-beginners', title: 'React for Beginners', teacher: 'Meera', price: 499 },
  { slug: 'python-from-zero', title: 'Python from Zero', teacher: 'Meera', price: 0 },
  { slug: 'devops-basics', title: 'DevOps Basics', teacher: 'Asha', price: 0 },
  { slug: 'sql-in-two-weeks', title: 'SQL in Two Weeks', teacher: 'Asha', price: 399 },
]
const SEED = ['meera@example.com', 'priya@example.com']
let waitlist = [...SEED]
const mode = () => fs.readFileSync(new URL('./mode.txt', import.meta.url), 'utf8').trim()

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost'), t0 = Date.now()
  const send = (code, body) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(body))
    console.log(`${req.method} ${url.pathname} ${code} ${Date.now() - t0}ms`) }
  const later = (ms, fn) => setTimeout(fn, ms)
  if (req.method === 'GET' && url.pathname === '/api/courses') return later(1200, () => send(200, COURSES))
  if (req.method === 'GET' && url.pathname === '/api/waitlist') return send(200, waitlist)
  if (req.method === 'POST' && url.pathname === '/api/reset') { waitlist = [...SEED]; return send(200, { ok: true }) }
  if (req.method === 'POST' && url.pathname === '/api/waitlist') {
    let body = ''; req.on('data', d => body += d)
    return req.on('end', () => later(1500, () => {
      const email = (JSON.parse(body || '{}').email || '').trim()
      if (!email.includes('@')) return send(400, { error: 'That does not look like an email' })
      if (mode() === 'fail') return send(500, { error: 'The mail service is down' })
      if (waitlist.includes(email)) return send(409, { error: 'You are already on the list' })
      waitlist.push(email); send(201, { email }) }))
  }
  send(404, { error: 'not found' })
}).listen(8144, () => console.log('practice API on http://localhost:8144'))
