// The practice A P I for the animations and offline lesson (module 22, lesson 2). A local stand-in, not the production server.
//   GET /api/courses -> { servedAt, courses }   (servedAt: the time the server answered)
import http from 'node:http'

const PORT = Number(process.env.PORT || 8222)
const COURSES = [
  ['react-for-beginners', 'React for Beginners', 'Meera', 'beginner', 499],
  ['python-from-zero', 'Python from Zero', 'Meera', 'beginner', 0],
  ['sql-in-two-weeks', 'SQL in Two Weeks', 'Asha', 'intermediate', 399],
].map(([slug, title, teacher, level, price]) => ({ slug, title, teacher, level, price }))
const t0 = Date.now()
const stamp = () => '+' + ((Date.now() - t0) / 1000).toFixed(1).padStart(5, ' ') + 's'
http
  .createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost')
    const cors = { 'access-control-allow-origin': '*', 'content-type': 'application/json' }
    if (url.pathname === '/api/courses') {
      const servedAt = new Date().toTimeString().slice(0, 8)
      console.log(`${stamp()} ${req.method.padEnd(4)} ${url.pathname.padEnd(14)} 200  servedAt ${servedAt}`)
      res.writeHead(200, cors); return res.end(JSON.stringify({ servedAt, courses: COURSES }))
    }
    console.log(`${stamp()} ${req.method.padEnd(4)} ${url.pathname.padEnd(14)} 404`)
    res.writeHead(404, cors); res.end(JSON.stringify({ error: 'not found' }))
  })
  .listen(PORT, () => console.log(`Practice API on http://localhost:${PORT}`))
