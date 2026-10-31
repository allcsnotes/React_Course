// The practice A P I (module 12, lesson 1). A stand-in for the allcsvideos server, with a request log.
//   POST /api/courses   JSON {title, price, level, description} -> 201 with the saved course (400 ms), 422 if the title is empty
//   GET  /api/courses   -> the saved courses
//   POST /reset         -> empty the list and the log
//   GET  /log           -> one line per request to /api, in order
import http from 'node:http'

let courses = [], log = []
const reset = () => { courses = []; log = [] }

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const send = (code, body, type = 'application/json') => { res.writeHead(code, { 'content-type': type }); res.end(typeof body === 'string' ? body : JSON.stringify(body)) }
  const p = url.pathname
  if (p === '/log') return send(200, log.map(l => l + '\n').join(''), 'text/plain')
  if (p === '/reset') { reset(); return send(200, { ok: true }) }
  if (p.startsWith('/api/')) log.push(`${req.method} ${p}`)
  if (p === '/api/courses' && req.method === 'GET') return send(200, courses)
  if (p === '/api/courses' && req.method === 'POST') {
    let raw = ''
    req.on('data', c => (raw += c))
    req.on('end', () => setTimeout(() => {
      const b = JSON.parse(raw || '{}')
      if (!String(b.title || '').trim()) return send(422, { error: 'The title is required' })
      const course = { slug: String(b.title).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'), ...b }
      courses.push(course)
      send(201, course)
    }, 400))
    return
  }
  send(404, { error: 'not found' })
}).listen(8121, () => console.log('API on http://localhost:8121'))
