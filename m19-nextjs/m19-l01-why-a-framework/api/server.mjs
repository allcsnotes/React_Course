// The practice A P I for module 19, lesson 1. A local stand-in, not the production server.
//   GET /api/courses -> the catalog (answers after 300 ms, like a real server far away)
import http from 'node:http'

const PORT = Number(process.env.PORT || 8191)
const DELAY = Number(process.env.DELAY || 300)
const COURSES = [
  ['react-for-beginners', 'React for Beginners', 'Meera', 'beginner', 499, 4.8],
  ['python-from-zero', 'Python from Zero', 'Meera', 'beginner', 0, 4.9],
  ['sql-in-two-weeks', 'SQL in Two Weeks', 'Asha', 'intermediate', 399, 4.7],
  ['docker-for-developers', 'Docker for Developers', 'Rahul', 'intermediate', 599, 4.8],
  ['javascript-essentials', 'JavaScript Essentials', 'Meera', 'beginner', 349, 4.8],
  ['git-and-github', 'Git and GitHub', 'Asha', 'beginner', 0, 4.6],
  ['node-apis', 'Node and APIs', 'Rahul', 'intermediate', 549, 4.7],
  ['typescript-in-practice', 'TypeScript in Practice', 'Asha', 'intermediate', 449, 4.8],
  ['system-design-basics', 'System Design Basics', 'Rahul', 'advanced', 799, 4.9],
  ['data-structures-java', 'Data Structures in Java', 'Meera', 'intermediate', 649, 4.8],
  ['linux-command-line', 'Linux Command Line', 'Rahul', 'beginner', 299, 4.5],
  ['aws-first-steps', 'AWS First Steps', 'Asha', 'intermediate', 699, 4.6],
].map(([slug, title, teacher, level, price, rating]) => ({ slug, title, teacher, level, price, rating, free: price === 0 }))
const t0 = Date.now()
const stamp = () => '+' + ((Date.now() - t0) / 1000).toFixed(1).padStart(6, ' ') + 's'

http
  .createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost')
    setTimeout(() => {
      const cors = { 'access-control-allow-origin': '*' }
      if (req.method === 'GET' && url.pathname === '/api/courses') {
        console.log(`${stamp()} GET ${url.pathname} 200`)
        res.writeHead(200, { 'content-type': 'application/json', ...cors })
        return res.end(JSON.stringify(COURSES))
      }
      console.log(`${stamp()} ${req.method} ${url.pathname} 404`)
      res.writeHead(404, { 'content-type': 'application/json', ...cors })
      res.end(JSON.stringify({ error: 'not found' }))
    }, DELAY)
  })
  .listen(PORT, () => console.log(`Practice API on http://localhost:${PORT} (answers after ${DELAY} ms)`))
