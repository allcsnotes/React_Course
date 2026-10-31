// The practice API for module 11, lesson 2 (a copy of the module 8 build 5 stand-in).
//   mode.txt = ok   -> normal answers
//   mode.txt = fail -> every answer is a 500 error
//   GET /api/courses          -> the list of courses
//   GET /api/courses/:slug    -> one course, with its lessons (404 if the slug is unknown)
// Every answer takes a real 600 ms (the page of the React course 1.8 s), like a real server. GET /__log lists every request the server saw, GET /__reset clears the list.
import http from 'node:http'
import fs from 'node:fs'

const COURSES = [
  { slug: 'react-for-beginners', title: 'React for Beginners', teacher: 'Meera', level: 'beginner', price: 499, lessons: [
    [1, 'What React is', 8], [2, 'Components as bricks', 11], [3, 'Props', 9], [4, 'State', 12]] },
  { slug: 'python-from-zero', title: 'Python from Zero', teacher: 'Meera', level: 'beginner', price: 0, lessons: [
    [1, 'Your first program', 7], [2, 'Variables', 9], [3, 'Loops', 10]] },
  { slug: 'devops-basics', title: 'DevOps Basics', teacher: 'Asha', level: 'beginner', price: 0, lessons: [
    [1, 'What DevOps means', 6], [2, 'Docker in ten minutes', 14], [3, 'Your first pipeline', 12]] },
  { slug: 'sql-in-two-weeks', title: 'SQL in Two Weeks', teacher: 'Asha', level: 'intermediate', price: 399, lessons: [
    [1, 'Tables and rows', 8], [2, 'Select and where', 10], [3, 'Joins', 13]] },
  { slug: 'docker-for-developers', title: 'Docker for Developers', teacher: 'Rahul', level: 'intermediate', price: 599, lessons: [
    [1, 'Images and containers', 11], [2, 'Volumes', 9], [3, 'Compose', 12]] },
  { slug: 'fastapi-in-practice', title: 'FastAPI in Practice', teacher: 'Meera', level: 'intermediate', price: 699, lessons: [
    [1, 'Your first endpoint', 9], [2, 'Models', 11], [3, 'Auth basics', 14]] },
  { slug: 'system-design', title: 'System Design', teacher: 'Rahul', level: 'advanced', price: 999, lessons: [
    [1, 'Thinking in boxes', 12], [2, 'Caching', 15], [3, 'Queues', 14], [4, 'Scaling a database', 18]] },
  { slug: 'async-python', title: 'Async Python', teacher: 'Rahul', level: 'advanced', price: 799, lessons: [
    [1, 'Why async', 9], [2, 'Tasks', 13], [3, 'Pitfalls', 12]] },
]
const mode = () => fs.readFileSync(new URL('./mode.txt', import.meta.url), 'utf8').trim()
const card = c => ({ slug: c.slug, title: c.title, teacher: c.teacher, level: c.level, price: c.price, free: c.price === 0, lessonCount: c.lessons.length })
let t0 = Date.now()
let log = []

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const send = (code, body) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(body)) }
  if (url.pathname === '/__log') return send(200, log)
  if (url.pathname === '/__reset') { t0 = Date.now(); log = []; return send(200, { ok: true }) }
  const entry = { ms: Date.now() - t0, path: url.pathname }
  const answer = (code, body) => { entry.status = code; log.push(entry); send(code, body) }
  // the React course page is slow on purpose (1.8 s), like in module 7, lesson 5; everything else takes 0.6 s
  const wait = fn => setTimeout(fn, url.pathname === '/api/courses/react-for-beginners' ? 1800 : 600)
  if (mode() === 'fail') return wait(() => answer(500, { error: 'The server is having a bad day' }))
  if (url.pathname === '/api/courses') return wait(() => answer(200, COURSES.map(card)))
  const m = url.pathname.match(/^\/api\/courses\/([^/]+)$/)
  if (m) {
    const c = COURSES.find(x => x.slug === m[1])
    return wait(() => c
      ? answer(200, { ...card(c), lessons: c.lessons.map(([id, title, minutes]) => ({ id, title, minutes, summary: `${title}. Watch the video, then try the practice task.` })) })
      : answer(404, { error: 'No course with that slug' }))
  }
  answer(404, { error: 'not found' })
}).listen(8112, () => console.log('API on http://localhost:8112'))
