// A small stand-in for the allcsvideos API (module 10, build 6):
//   GET /api/courses          -> the list of courses
//   GET /api/courses/:slug    -> one course (404 if the slug is unknown)
// Every answer takes a real 400 ms, like a real server.
import http from 'node:http'

const COURSES = [
  { slug: 'react-for-beginners', title: 'React for Beginners', teacher: 'Meera', level: 'beginner', price: 499, lessonCount: 4 },
  { slug: 'python-from-zero', title: 'Python from Zero', teacher: 'Meera', level: 'beginner', price: 0, lessonCount: 3 },
  { slug: 'devops-basics', title: 'DevOps Basics', teacher: 'Asha', level: 'beginner', price: 0, lessonCount: 3 },
  { slug: 'sql-in-two-weeks', title: 'SQL in Two Weeks', teacher: 'Asha', level: 'intermediate', price: 399, lessonCount: 3 },
  { slug: 'docker-for-developers', title: 'Docker for Developers', teacher: 'Rahul', level: 'intermediate', price: 599, lessonCount: 3 },
  { slug: 'system-design', title: 'System Design', teacher: 'Rahul', level: 'advanced', price: 999, lessonCount: 4 },
].map(c => ({ ...c, free: c.price === 0 }))

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const send = (code, body) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(body)) }
  const wait = fn => setTimeout(fn, 400)
  if (url.pathname === '/api/courses') return wait(() => send(200, COURSES))
  const m = url.pathname.match(/^\/api\/courses\/([^/]+)$/)
  if (m) { const c = COURSES.find(x => x.slug === m[1]); return wait(() => c ? send(200, c) : send(404, { error: 'No course with that slug' })) }
  send(404, { error: 'not found' })
}).listen(8106, () => console.log('API on http://localhost:8106'))
