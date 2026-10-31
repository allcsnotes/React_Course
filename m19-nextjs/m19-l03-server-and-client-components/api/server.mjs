// The practice A P I for the server/client lesson (port 8193). It only answers when the secret key is sent.
//   GET /api/courses  (header x-api-key: allcs-secret-7421)  ->  the courses, with a Markdown "about" text
import http from 'node:http'

const KEY = 'allcs-secret-7421'
const COURSES = [
  { id: 'react', title: 'React for Beginners', teacher: 'Meera', about: 'Build **real pages** from small parts. You will *type every line* yourself.' },
  { id: 'sql', title: 'SQL in Two Weeks', teacher: 'Asha', about: 'Ask a database **real questions**. Joins, groups and *no guessing*.' },
  { id: 'docker', title: 'Docker for Developers', teacher: 'Rahul', about: 'Run your app **the same way** on every machine. *One command* to start.' },
]
http.createServer((req, res) => {
  console.log(new Date().toISOString().slice(11, 19), req.method, req.url, req.headers['x-api-key'] ? 'key sent' : 'no key')
  if (req.url === '/api/courses') {
    if (req.headers['x-api-key'] !== KEY) { res.writeHead(401, { 'content-type': 'application/json' }); return res.end('{"error":"no key"}') }
    res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify(COURSES))
  }
  res.writeHead(404); res.end()
}).listen(8193, () => console.log('API on http://localhost:8193'))
