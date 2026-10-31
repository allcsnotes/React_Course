// A small stand-in for the allcsvideos API (module 11, lesson 3): "the practice API". Not the production server.
//   mode.txt = ok   -> enrolling works
//   mode.txt = fail -> enrolling always fails with 500 (the payment service is down)
//   GET  /api/courses      -> the list of courses, each with "enrolled": true/false   (takes 300 ms)
//   POST /api/enrollments  -> body {"slug": "..."}; marks the course enrolled          (takes 1500 ms)
//   POST /api/reset        -> forget all enrollments (used between recordings)
// Every request prints one log line: METHOD PATH STATUS DURATION.
import http from 'node:http'
import fs from 'node:fs'

const COURSES = [
  { slug: 'react-for-beginners', title: 'React for Beginners', teacher: 'Meera', price: 499 },
  { slug: 'python-from-zero', title: 'Python from Zero', teacher: 'Meera', price: 0 },
  { slug: 'devops-basics', title: 'DevOps Basics', teacher: 'Asha', price: 0 },
  { slug: 'sql-in-two-weeks', title: 'SQL in Two Weeks', teacher: 'Asha', price: 399 },
]
const enrolled = new Set()
const mode = () => fs.readFileSync(new URL('./mode.txt', import.meta.url), 'utf8').trim()
const view = c => ({ ...c, enrolled: enrolled.has(c.slug) })

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost'), t0 = Date.now()
  const send = (code, body) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(body))
    console.log(`${req.method} ${url.pathname} ${code} ${Date.now() - t0}ms`) }
  const later = (ms, fn) => setTimeout(fn, ms)
  if (req.method === 'GET' && url.pathname === '/api/courses') return later(300, () => send(200, COURSES.map(view)))
  if (req.method === 'POST' && url.pathname === '/api/reset') { enrolled.clear(); return send(200, { ok: true }) }
  if (req.method === 'POST' && url.pathname === '/api/enrollments') {
    let body = ''; req.on('data', d => body += d)
    return req.on('end', () => later(1500, () => {
      const c = COURSES.find(x => x.slug === JSON.parse(body || '{}').slug)
      if (!c) return send(404, { error: 'No course with that slug' })
      if (mode() === 'fail') return send(500, { error: 'The payment service is down' })
      if (enrolled.has(c.slug)) return send(409, { error: 'You are already enrolled' })
      enrolled.add(c.slug); send(201, view(c)) }))
  }
  send(404, { error: 'not found' })
}).listen(8113, () => console.log('practice API on http://localhost:8113'))
