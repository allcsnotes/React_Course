// The practice A P I for the App Router lesson (module 19, lesson 2). A local stand-in, not the production server.
//   GET  /api/courses          -> the catalog (answers after 1200 ms)
//   GET  /api/courses/:slug    -> one course (800 ms) | 404 {error} | 500 {error} while the API is "broken"
//   POST /api/break, /api/fix  -> switch the detail answers to 500 / back to normal
import http from 'node:http'

const PORT = Number(process.env.PORT || 8192)
const COURSES = [
  { slug: 'react-for-beginners', title: 'React for Beginners', teacher: 'Meera', level: 'beginner', price: 499, lessonCount: 4 },
  { slug: 'python-from-zero', title: 'Python from Zero', teacher: 'Meera', level: 'beginner', price: 0, lessonCount: 3 },
  { slug: 'sql-in-two-weeks', title: 'SQL in Two Weeks', teacher: 'Asha', level: 'intermediate', price: 399, lessonCount: 3 },
  { slug: 'docker-for-developers', title: 'Docker for Developers', teacher: 'Rahul', level: 'intermediate', price: 599, lessonCount: 3 },
]
let broken = false
const t0 = Date.now()
const stamp = () => '+' + ((Date.now() - t0) / 1000).toFixed(1).padStart(5, ' ') + 's'

http
  .createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost')
    const send = (code, obj, ms = 0) => {
      setTimeout(() => {
        console.log(`${stamp()} ${req.method.padEnd(5)} ${url.pathname.padEnd(30)} ${code}`)
        res.writeHead(code, { 'content-type': 'application/json' })
        res.end(JSON.stringify(obj))
      }, ms)
    }
    const route = `${req.method} ${url.pathname}`
    if (route === 'GET /api/courses') return send(200, COURSES, 1200)
    if (route === 'POST /api/break') { broken = true; return send(200, { broken }) }
    if (route === 'POST /api/fix') { broken = false; return send(200, { broken }) }
    const m = url.pathname.match(/^\/api\/courses\/([\w-]+)$/)
    if (req.method === 'GET' && m) {
      if (broken) return send(500, { error: 'database is down' }, 800)
      const c = COURSES.find((x) => x.slug === m[1])
      return c ? send(200, c, 800) : send(404, { error: 'course not found' }, 800)
    }
    send(404, { error: 'no such route' })
  })
  .listen(PORT, () => console.log(`practice API on http://localhost:${PORT}`))
