// local course API for the lesson: GET /api/courses?q=py&delay=600&fail=500   (never calls the internet)
import http from 'node:http'

const courses = [
  { id: 1, title: 'React for Beginners', teacher: 'Meera', lessons: 12 },
  { id: 2, title: 'Python from Zero', teacher: 'Meera', lessons: 20 },
  { id: 3, title: 'System Design', teacher: 'Rahul', lessons: 25 },
  { id: 4, title: 'DevOps Basics', teacher: 'Asha', lessons: 15 },
  { id: 5, title: 'Python Pro', teacher: 'Meera', lessons: 18 },
  { id: 6, title: 'Docker Essentials', teacher: 'Asha', lessons: 10 },
  { id: 7, title: 'Git Basics', teacher: 'Asha', lessons: 8 },
  { id: 8, title: 'React Hooks Deep Dive', teacher: 'Meera', lessons: 14 },
]
const log = []
const note = s => { log.push(s); console.log(s) }

http.createServer((req, res) => {
  const u = new URL(req.url, 'http://localhost')
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (u.pathname === '/__log') { res.setHeader('content-type', 'application/json'); return res.end(JSON.stringify(log)) }
  if (u.pathname === '/__clear') { log.length = 0; return res.end('ok') }
  if (u.pathname !== '/api/courses') { res.statusCode = 404; return res.end('not found') }
  const q = (u.searchParams.get('q') || '').toLowerCase()
  const delay = Number(u.searchParams.get('delay') || 0)
  const fail = Number(u.searchParams.get('fail') || 0)
  const label = 'GET /api/courses?q=' + (u.searchParams.get('q') || '')
  const timer = setTimeout(() => {
    res.setHeader('content-type', 'application/json')
    if (fail) { res.statusCode = fail; res.end(JSON.stringify({ error: 'server error' })); note(label + '  ->  ' + fail); return }
    const out = courses.filter(c => c.title.toLowerCase().includes(q)).slice(0, 4)
    res.end(JSON.stringify(out)); note(label + '  ->  200, ' + out.length + (out.length === 1 ? ' course' : ' courses'))
  }, delay)
  res.on('close', () => { if (!res.writableEnded) { clearTimeout(timer); note(label + '  ->  aborted by the browser') } })
}).listen(8176, () => console.log('api on 8176'))
