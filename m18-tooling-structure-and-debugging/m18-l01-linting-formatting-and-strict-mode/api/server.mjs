// A small stand-in for the allcsvideos API (module 18, lesson 1):
//   GET /api/courses          -> the list of courses
//   GET /api/courses/:slug    -> one course, with its lessons (404 if the slug is unknown)
// CORS is open so the page on another port may call it.
// Every answer takes a real 600 ms, like a real server.
import http from 'node:http'

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
const card = c => ({ slug: c.slug, title: c.title, teacher: c.teacher, level: c.level, price: c.price, free: c.price === 0, lessonCount: c.lessons.length })

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const send = (code, body) => { res.writeHead(code, { 'content-type': 'application/json', 'access-control-allow-origin': '*' }); res.end(JSON.stringify(body)) }
  const wait = fn => setTimeout(fn, 600)
  if (url.pathname === '/api/courses') return wait(() => send(200, COURSES.map(card)))
  const m = url.pathname.match(/^\/api\/courses\/([^/]+)$/)
  if (m) {
    const c = COURSES.find(x => x.slug === m[1])
    return wait(() => c
      ? send(200, { ...card(c), lessons: c.lessons.map(([id, title, minutes]) => ({ id, title, minutes, summary: `${title}. Watch the video, then try the practice task.` })) })
      : send(404, { error: 'No course with that slug' }))
  }
  send(404, { error: 'not found' })
}).listen(8181, () => console.log('API on http://localhost:8181'))
