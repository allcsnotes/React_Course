// A small stand-in for the allcsvideos catalog API: GET /api/courses?q=...  (a real delay, a switch for server trouble)
import http from 'node:http'

const COURSES = [
  { id: 1, title: 'React for Beginners', price: 499 },
  { id: 2, title: 'Python from Zero', price: 0 },
  { id: 3, title: 'Python Basics', price: 499 },
  { id: 4, title: 'SQL in Two Weeks', price: 399 },
  { id: 5, title: 'Git and GitHub', price: 299 },
  { id: 6, title: 'Docker for Developers', price: 599 },
  { id: 7, title: 'FastAPI in Practice', price: 699 },
  { id: 8, title: 'Async Python', price: 799 },
  { id: 9, title: 'Python Performance', price: 899 },
  { id: 10, title: 'React Hooks in Practice', price: 599 },
  { id: 11, title: 'Testing React Apps', price: 699 },
  { id: 12, title: 'DevOps Basics', price: 0 },
  { id: 13, title: 'System Design', price: 999 },
  { id: 14, title: 'Linux Essentials', price: 349 },
]

let broken = false          // the "server trouble" switch
let log = []                // what the server saw, in order
const t0 = Date.now()
const now = () => Date.now() - t0

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const send = (code, body) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(body)) }
  if (url.pathname === '/__admin/fail') { broken = url.searchParams.get('on') === '1'; return send(200, { broken }) }
  if (url.pathname === '/__admin/reset') { log = []; return send(200, { ok: true }) }
  if (url.pathname === '/__admin/log') return send(200, log)
  if (url.pathname !== '/api/courses') return send(404, { error: 'not found' })

  const q = (url.searchParams.get('q') || '').trim().toLowerCase()
  const items = COURSES.filter(c => c.title.toLowerCase().includes(q))
  // a bigger answer takes longer, like a real server: 300 ms + 150 ms for every course found
  const delay = url.searchParams.has('delay') ? Number(url.searchParams.get('delay')) : 300 + 150 * items.length
  const entry = { q, found: items.length, delay, start: now(), end: null, how: 'waiting' }
  log.push(entry)
  const timer = setTimeout(() => {
    if (broken) { entry.how = '500'; entry.end = now(); return send(500, { error: 'database is down' }) }
    entry.how = 'done'; entry.end = now(); send(200, { items, total: items.length })
  }, delay)
  res.on('close', () => { if (!res.writableFinished) { clearTimeout(timer); entry.how = 'cancelled'; entry.end = now() } })
}).listen(8174, () => console.log('API on http://localhost:8174'))
