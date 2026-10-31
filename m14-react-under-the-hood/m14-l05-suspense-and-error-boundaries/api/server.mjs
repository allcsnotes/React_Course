// A small stand-in for the allcsvideos practice API (module 14, lesson 5). Every answer takes a real delay.
//   GET /api/courses/:slug            -> one course              (600 ms)
//   GET /api/courses/:slug/lessons    -> its lessons             (1200 ms)
//   GET /api/courses/:slug/reviews    -> its reviews             (3000 ms, behaviour set with /_mode)
//   GET /_mode?reviews=ok|broken|fail|failonce   -> switches how the reviews answer (for the lesson's experiments)
import http from 'node:http'

const COURSES = {
  'react-for-beginners': { title: 'React for Beginners', teacher: 'Meera', lessons: ['What React is', 'Components as bricks', 'Props', 'State'] },
  'python-from-zero': { title: 'Python from Zero', teacher: 'Meera', lessons: ['Your first program', 'Variables', 'Loops'] },
}
const REVIEWS = [
  { id: 1, author: { name: 'Lukas' }, stars: 5, text: 'Clear and calm. I finally understand state.' },
  { id: 2, author: { name: 'Priya' }, stars: 4, text: 'Good pace. More practice tasks, please.' },
  { id: 3, author: { name: 'Asha' }, stars: 5, text: 'The bricks picture made props click.' },
]
let mode = 'ok', failed = false
const CORS = { 'access-control-allow-origin': '*', 'content-type': 'application/json' }

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const send = (code, body) => { res.writeHead(code, CORS); res.end(JSON.stringify(body)) }
  const wait = (ms, fn) => setTimeout(fn, ms)
  if (url.pathname === '/_mode') { mode = url.searchParams.get('reviews') || 'ok'; failed = false; return send(200, { reviews: mode }) }
  const m = url.pathname.match(/^\/api\/courses\/([^/]+)(?:\/(lessons|reviews))?$/)
  const c = m && COURSES[m[1]]
  if (!c) return send(404, { error: 'not found' })
  if (!m[2]) return wait(600, () => send(200, { slug: m[1], title: c.title, teacher: c.teacher }))
  if (m[2] === 'lessons') return wait(1200, () => send(200, c.lessons.map((title, i) => ({ id: i + 1, title, minutes: 8 + i * 2 }))))
  return wait(3000, () => {
    if (mode === 'fail' || (mode === 'failonce' && !failed)) { failed = true; return send(500, { error: 'The reviews service is down' }) }
    if (mode === 'broken') return send(200, REVIEWS.map((r, i) => (i === 1 ? { id: r.id, stars: r.stars, text: r.text } : r)))
    send(200, REVIEWS)
  })
}).listen(8145, () => console.log('API on http://localhost:8145'))
