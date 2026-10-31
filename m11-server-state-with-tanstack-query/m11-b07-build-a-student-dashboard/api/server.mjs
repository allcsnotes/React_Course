// The practice A P I for the student dashboard (module 11, build 7). Lukas is signed in; there is no login yet (module 13).
//   GET  /api/me/courses                                -> Lukas's courses, with how many lessons he completed
//   GET  /api/me/courses/:slug                          -> one course, with every lesson and a done flag
//   POST /api/me/courses/:slug/lessons/:id/complete     -> marks a lesson complete
//   POST /api/reset                                     -> back to the starting data (for the video's tests)
// mode.txt:  ok = everything works | fail = saving a lesson fails with 500 | down = reading fails with 503
// Reading takes 400 ms, saving takes 1200 ms, like a real server on a slow day.
import http from 'node:http'
import fs from 'node:fs'

const START = () => [
  { slug: 'react-for-beginners', title: 'React for Beginners', teacher: 'Meera', lessons: [
    [1, 'What React is', 8, true], [2, 'Components as bricks', 11, true], [3, 'Props', 9, false], [4, 'State', 12, false]] },
  { slug: 'python-from-zero', title: 'Python from Zero', teacher: 'Meera', lessons: [
    [1, 'Your first program', 7, true], [2, 'Variables', 9, true], [3, 'Loops', 10, true]] },
  { slug: 'sql-in-two-weeks', title: 'SQL in Two Weeks', teacher: 'Asha', lessons: [
    [1, 'Tables and rows', 8, true], [2, 'Select and where', 10, false], [3, 'Joins', 13, false]] },
  { slug: 'system-design', title: 'System Design', teacher: 'Rahul', lessons: [
    [1, 'Thinking in boxes', 12, false], [2, 'Caching', 15, false], [3, 'Queues', 14, false], [4, 'Scaling a database', 18, false]] },
]
let COURSES = START()
const mode = () => fs.readFileSync(new URL('./mode.txt', import.meta.url), 'utf8').trim()
const summary = c => ({ slug: c.slug, title: c.title, teacher: c.teacher, lessonCount: c.lessons.length, completedCount: c.lessons.filter(l => l[3]).length })
const detail = c => ({ slug: c.slug, title: c.title, teacher: c.teacher, lessons: c.lessons.map(([id, title, minutes, done]) => ({ id, title, minutes, done })) })

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const send = (code, body) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(body)) }
  const wait = (ms, fn) => setTimeout(fn, ms)
  if (req.method === 'POST' && url.pathname === '/api/reset') { COURSES = START(); return send(200, { ok: true }) }
  if (req.method === 'GET' && url.pathname === '/api/me/courses') {
    return wait(400, () => mode() === 'down' ? send(503, { error: 'The server is down' }) : send(200, COURSES.map(summary)))
  }
  let m = url.pathname.match(/^\/api\/me\/courses\/([^/]+)$/)
  if (req.method === 'GET' && m) {
    const c = COURSES.find(x => x.slug === m[1])
    return wait(400, () => mode() === 'down' ? send(503, { error: 'The server is down' }) : c ? send(200, detail(c)) : send(404, { error: 'You are not enrolled in that course' }))
  }
  m = url.pathname.match(/^\/api\/me\/courses\/([^/]+)\/lessons\/(\d+)\/complete$/)
  if (req.method === 'POST' && m) {
    return wait(1200, () => {
      if (mode() === 'fail') return send(500, { error: 'The server could not save your progress' })
      const c = COURSES.find(x => x.slug === m[1]), l = c && c.lessons.find(x => x[0] === Number(m[2]))
      if (!l) return send(404, { error: 'No such lesson' })
      l[3] = true; send(200, { lessonId: l[0], done: true })
    })
  }
  send(404, { error: 'not found' })
}).listen(8217, () => console.log('Practice API on http://localhost:8217'))
