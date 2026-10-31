// the allcsvideos API, tiny local version for this lesson (port 8184)
//   GET  /api/courses          the catalog                 (delay: listDelay)
//   GET  /api/courses/:id      one course, + enrolled flag (delay: listDelay)
//   GET  /api/me               who is signed in            (delay: listDelay)
//   GET  /api/my-courses       the enrolled courses        (delay: listDelay)   NOTE: no login check, on purpose
//   POST /api/enrollments      { courseId }  -> enrolls Lukas                   (delay: 500 ms)
// switches: /api/_control?mode=ok|fail  &delay=<ms>  &reset=1 (clears the log + the enrollments)
// /api/_log returns every request with its start time (ms since reset) and its end time
import http from 'http'
const COURSES = [
  { id: 1, title: 'React for Beginners', teacher: 'Meera', lessons: 12, price: 499, free: false },
  { id: 2, title: 'Python from Zero', teacher: 'Meera', lessons: 20, price: 0, free: true },
  { id: 3, title: 'System Design', teacher: 'Rahul', lessons: 25, price: 999, free: false },
  { id: 4, title: 'DevOps Basics', teacher: 'Asha', lessons: 15, price: 0, free: true },
]
let mode = 'ok', delay = 900, t0 = Date.now(), log = [], enrolled = []
const send = (res, code, body) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(body)) }
http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x'), now = Date.now()
  if (u.pathname === '/api/_control') {
    if (u.searchParams.get('mode')) mode = u.searchParams.get('mode')
    if (u.searchParams.get('delay')) delay = +u.searchParams.get('delay')
    if (u.searchParams.get('reset')) { log = []; enrolled = []; t0 = Date.now() }
    return send(res, 200, { mode, delay, enrolled })
  }
  if (u.pathname === '/api/_log') return send(res, 200, log)
  const entry = { what: req.method + ' ' + u.pathname.replace('/api', ''), at: now - t0, status: 0, done: null }
  log.push(entry)
  let body = ''
  req.on('data', c => body += c)
  req.on('end', () => {
    const d = req.method === 'POST' ? 500 : delay
    setTimeout(() => {
      const reply = (code, b) => { entry.status = code; entry.done = Date.now() - t0; send(res, code, b) }
      if (mode === 'fail' && req.method === 'GET') return reply(500, { detail: 'Internal Server Error' })
      let m
      if (u.pathname === '/api/courses' && req.method === 'GET') return reply(200, COURSES.map(c => ({ ...c, enrolled: enrolled.includes(c.id) })))
      if ((m = u.pathname.match(/^\/api\/courses\/(\d+)$/)) && req.method === 'GET') {
        const c = COURSES.find(c => c.id === +m[1]); return c ? reply(200, { ...c, enrolled: enrolled.includes(c.id) }) : reply(404, { detail: 'Not Found' })
      }
      if (u.pathname === '/api/me') return reply(200, { name: 'Lukas' })
      if (u.pathname === '/api/my-courses') return reply(200, COURSES.filter(c => enrolled.includes(c.id)))
      if (u.pathname === '/api/enrollments' && req.method === 'POST') {
        const { courseId } = JSON.parse(body || '{}'); if (!COURSES.some(c => c.id === courseId)) return reply(404, { detail: 'Not Found' })
        if (!enrolled.includes(courseId)) enrolled.push(courseId); return reply(201, { courseId, student: 'Lukas' })
      }
      reply(404, { detail: 'Not Found' })
    }, d)
  })
}).listen(8184, () => console.log('api on 8184'))
