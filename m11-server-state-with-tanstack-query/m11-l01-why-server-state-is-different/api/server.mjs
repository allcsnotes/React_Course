// The practice A P I (module 11, lesson 1). A stand-in for the allcsvideos server, with a request log.
//   GET  /api/courses            -> the list of courses (300 ms)
//   GET  /api/teachers/:name     -> one teacher: how many courses they teach (300 ms)
//   POST /api/checkout?slug&price-> 409 if the price is not the current price
//   POST /sale?slug&price        -> Meera changes a price on the server
//   POST /reset                  -> prices back to the start, log emptied
//   GET  /log                    -> one line per request to /api, in order
import http from 'node:http'

const START = [
  ['react-for-beginners', 'React for Beginners', 'Meera', 'beginner', 499],
  ['python-from-zero', 'Python from Zero', 'Meera', 'beginner', 0],
  ['devops-basics', 'DevOps Basics', 'Asha', 'beginner', 0],
  ['sql-in-two-weeks', 'SQL in Two Weeks', 'Asha', 'intermediate', 399],
  ['docker-for-developers', 'Docker for Developers', 'Rahul', 'intermediate', 599],
  ['fastapi-in-practice', 'FastAPI in Practice', 'Meera', 'intermediate', 699],
  ['system-design', 'System Design', 'Rahul', 'advanced', 999],
  ['async-python', 'Async Python', 'Rahul', 'advanced', 799],
]
let courses, log
const reset = () => { courses = START.map(([slug, title, teacher, level, price]) => ({ slug, title, teacher, level, price, free: price === 0 })); log = [] }
reset()

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const send = (code, body, type = 'application/json') => { res.writeHead(code, { 'content-type': type }); res.end(typeof body === 'string' ? body : JSON.stringify(body)) }
  const wait = fn => setTimeout(fn, 300)
  const p = url.pathname
  if (p === '/log') return send(200, log.map(l => l + '\n').join(''), 'text/plain')
  if (p === '/reset') { reset(); return send(200, { ok: true }) }
  if (p === '/sale' && req.method === 'POST') {
    const c = courses.find(x => x.slug === url.searchParams.get('slug'))
    if (!c) return send(404, { error: 'No course with that slug' })
    c.price = Number(url.searchParams.get('price')); c.free = c.price === 0
    return send(200, { slug: c.slug, price: c.price })
  }
  if (p.startsWith('/api/')) log.push(`${req.method} ${p}`)
  if (p === '/api/courses') return wait(() => send(200, courses))
  let m = p.match(/^\/api\/teachers\/([^/]+)$/)
  if (m) { const name = decodeURIComponent(m[1]); const n = courses.filter(c => c.teacher === name).length
    return wait(() => n ? send(200, { name, courses: n }) : send(404, { error: 'No teacher with that name' })) }
  if (p === '/api/checkout' && req.method === 'POST') {
    const c = courses.find(x => x.slug === url.searchParams.get('slug')); const asked = Number(url.searchParams.get('price'))
    if (!c) return send(404, { error: 'No course with that slug' })
    if (c.price !== asked) return send(409, { status: 409, error: `The price changed. It is now ${c.price}.` })
    return send(200, { ok: true, total: c.price })
  }
  send(404, { error: 'not found' })
}).listen(8111, () => console.log('API on http://localhost:8111'))
