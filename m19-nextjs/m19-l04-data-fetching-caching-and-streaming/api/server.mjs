// The practice A P I for module 19, lesson 4. A local stand-in, not the production server.
//   GET /api/courses            -> the catalog            (300 ms)
//   GET /api/offer              -> today's offer, with a serial number that counts every call (300 ms)
//   GET /api/courses/:slug/reviews -> the reviews         (2000 ms)
//   GET /api/_hits  POST /api/_reset -> call counter (instant, for the lesson)
import http from 'node:http'

const PORT = Number(process.env.PORT || 8194)
const COURSES = [
  { slug: 'react-for-beginners', title: 'React for Beginners', teacher: 'Meera', price: 499 },
  { slug: 'python-from-zero', title: 'Python from Zero', teacher: 'Meera', price: 0 },
  { slug: 'sql-in-two-weeks', title: 'SQL in Two Weeks', teacher: 'Asha', price: 399 },
  { slug: 'docker-for-developers', title: 'Docker for Developers', teacher: 'Rahul', price: 599 },
]
const REVIEWS = [
  { who: 'Lukas', stars: 5, text: 'Clear and calm. I built my first page.' },
  { who: 'Priya', stars: 4, text: 'Great examples, I wanted more exercises.' },
]
let hits = {}
let serial = 0
const t0 = Date.now()
const stamp = () => '+' + ((Date.now() - t0) / 1000).toFixed(1).padStart(5, ' ') + 's'

http
  .createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost')
    const send = (code, obj, ms) => setTimeout(() => {
      console.log(`${stamp()} ${req.method.padEnd(4)} ${url.pathname}`)
      res.writeHead(code, { 'content-type': 'application/json' })
      res.end(JSON.stringify(obj))
    }, ms)
    const route = `${req.method} ${url.pathname}`
    if (route === 'GET /api/_hits') { res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify(hits)) }
    if (route === 'POST /api/_reset') { hits = {}; serial = 0; res.writeHead(200); return res.end('ok') }
    const count = (k) => { hits[k] = (hits[k] || 0) + 1 }
    if (route === 'GET /api/courses') { count('courses'); return send(200, COURSES, Number(url.searchParams.get('ms') || 300)) }
    if (route === 'GET /api/offer') { count('offer'); serial += 1; return send(200, { serial, text: '10 percent off today' }, 300) }
    const m = url.pathname.match(/^\/api\/courses\/([\w-]+)\/reviews$/)
    if (req.method === 'GET' && m) { count('reviews'); return send(200, REVIEWS, Number(url.searchParams.get('ms') || 2000)) }
    send(404, { error: 'not found' }, 0)
  })
  .listen(PORT, () => console.log(`Practice API on http://localhost:${PORT}`))
