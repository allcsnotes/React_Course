// the allcsvideos catalog API, tiny version: GET /api/courses?q=  and  GET /api/courses/:id
// switches: /api/_control?mode=ok|fail|empty  &delay=<ms for the list>   (fail = every list/detail request answers 500)
// /api/_log returns every request with timing and whether the browser cancelled it; /api/_control?reset=1 clears the log
import http from 'http'
const COURSES = [
  { id: 1, title: 'React for Beginners', teacher: 'Meera', lessons: 12, price: 499, free: false },
  { id: 2, title: 'Python from Zero', teacher: 'Meera', lessons: 20, price: 0, free: true },
  { id: 3, title: 'System Design', teacher: 'Rahul', lessons: 25, price: 999, free: false },
  { id: 4, title: 'DevOps Basics', teacher: 'Asha', lessons: 15, price: 0, free: true },
]
const DETAIL_DELAY = { 1: 2000, 2: 400, 3: 400, 4: 400 }   // the React page is the slow one, on purpose
const LESSONS = [
  { id: 1, title: 'What is a component?', minutes: 8 },
  { id: 2, title: 'Props in practice', minutes: 11 },
  { id: 3, title: 'State and events', minutes: 14 },
  { id: 4, title: 'Lists and keys', minutes: 9 },
]
let mode = 'ok', listDelay = 1200, t0 = Date.now(), log = []
const send = (res, code, body) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(body)) }
http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x'), now = Date.now()
  if (u.pathname === '/api/_control') {
    if (u.searchParams.get('mode')) mode = u.searchParams.get('mode')
    if (u.searchParams.get('delay')) listDelay = +u.searchParams.get('delay')
    if (u.searchParams.get('reset')) { log = []; t0 = Date.now() }
    return send(res, 200, { mode, listDelay })
  }
  if (u.pathname === '/api/_log') return send(res, 200, log)
  if (u.pathname === '/api/lessons') {
    const entry = { what: 'lessons', at: now - t0, status: 0, done: null, cancelled: false }; log.push(entry)
    const timer = setTimeout(() => { if (mode === 'fail' || mode === 'faillessons') { entry.status = 500; return send(res, 500, { detail: 'Internal Server Error' }) } entry.status = 200; send(res, 200, mode === 'empty' ? [] : LESSONS) }, 700)
    res.on('close', () => { entry.done = Date.now() - t0; if (!res.writableFinished) { entry.cancelled = true; entry.status = 0; clearTimeout(timer) } })
    return
  }
  const m = u.pathname.match(/^\/api\/courses(?:\/(\d+))?$/)
  if (!m) return send(res, 404, { detail: 'Not Found' })
  const id = m[1] ? +m[1] : null, q = (u.searchParams.get('q') || '').toLowerCase()
  const delay = id ? DETAIL_DELAY[id] ?? 400 : q ? 600 : listDelay
  const entry = { what: id ? 'course ' + id : q ? 'search ' + q : u.searchParams.has('q') ? 'search (empty)' : 'list', at: now - t0, status: 0, done: null, cancelled: false }
  log.push(entry)
  const timer = setTimeout(() => {
    if (mode === 'fail') { entry.status = 500; return send(res, 500, { detail: 'Internal Server Error' }) }
    entry.status = 200
    if (id) { const c = COURSES.find(c => c.id === id); entry.status = c ? 200 : 404; return send(res, entry.status, c || { detail: 'Not Found' }) }
    send(res, 200, mode === 'empty' ? [] : COURSES.filter(c => c.title.toLowerCase().includes(q)))
  }, delay)
  res.on('close', () => { entry.done = Date.now() - t0; if (!res.writableFinished) { entry.cancelled = true; entry.status = 0; clearTimeout(timer) } })
}).listen(8193, () => console.log('api on http://localhost:8193'))
