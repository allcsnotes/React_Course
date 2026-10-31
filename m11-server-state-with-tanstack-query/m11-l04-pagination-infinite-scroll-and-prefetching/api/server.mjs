// The practice A P I (stand-in for allcsvideos, module 11, lesson 4).
//   GET /api/courses                       -> ALL courses (the old way)
//   GET /api/courses?page=2&pageSize=6     -> one page: { items, page, pageSize, total, totalPages, nextPage }
// Every answer takes a real 500 ms. Every request is also written to api.log (time, method, url).
import http from 'node:http'
import fs from 'node:fs'

const T = [
  ['React for Beginners', 'Meera', 'beginner', 499], ['Python from Zero', 'Meera', 'beginner', 0], ['DevOps Basics', 'Asha', 'beginner', 0],
  ['SQL in Two Weeks', 'Asha', 'intermediate', 399], ['Docker for Developers', 'Rahul', 'intermediate', 599], ['FastAPI in Practice', 'Meera', 'intermediate', 699],
  ['System Design', 'Rahul', 'advanced', 999], ['Async Python', 'Rahul', 'advanced', 799], ['Git and GitHub', 'Asha', 'beginner', 0],
  ['Linux Basics', 'Rahul', 'beginner', 299], ['HTML and CSS', 'Meera', 'beginner', 0], ['JavaScript Essentials', 'Meera', 'beginner', 349],
  ['TypeScript in Practice', 'Asha', 'intermediate', 449], ['Node.js APIs', 'Rahul', 'intermediate', 549], ['PostgreSQL Deep Dive', 'Asha', 'advanced', 849],
  ['Redis and Caching', 'Rahul', 'intermediate', 499], ['Kubernetes Basics', 'Asha', 'intermediate', 749], ['Terraform Starter', 'Rahul', 'intermediate', 649],
  ['Data Structures', 'Meera', 'intermediate', 599], ['Algorithms', 'Meera', 'advanced', 899], ['Spring Boot', 'Rahul', 'intermediate', 799],
  ['Java for Beginners', 'Asha', 'beginner', 0], ['Go in Practice', 'Rahul', 'intermediate', 699], ['Rust Basics', 'Asha', 'advanced', 899],
  ['Machine Learning 101', 'Meera', 'beginner', 599], ['Pandas and NumPy', 'Meera', 'intermediate', 499], ['Web Security', 'Rahul', 'advanced', 949],
  ['Testing with Vitest', 'Asha', 'intermediate', 399], ['CI/CD Pipelines', 'Rahul', 'intermediate', 599], ['AWS Essentials', 'Asha', 'beginner', 499],
  ['Next.js in Practice', 'Meera', 'advanced', 849], ['Tailwind CSS', 'Meera', 'beginner', 249], ['GraphQL Basics', 'Asha', 'intermediate', 549],
  ['Microservices', 'Rahul', 'advanced', 999], ['Message Queues', 'Rahul', 'advanced', 799], ['Observability', 'Asha', 'advanced', 899],
  ['Shell Scripting', 'Rahul', 'beginner', 0], ['Regex in a Weekend', 'Meera', 'beginner', 199], ['Clean Code', 'Asha', 'intermediate', 349],
  ['Design Patterns', 'Rahul', 'advanced', 749], ['Accessibility', 'Meera', 'intermediate', 299], ['Performance Tuning', 'Asha', 'advanced', 849],
  ['Mobile with React Native', 'Meera', 'intermediate', 699], ['Docker Compose', 'Rahul', 'beginner', 0], ['API Design', 'Asha', 'intermediate', 599],
  ['Career Skills for Devs', 'Meera', 'beginner', 0], ['Open Source Basics', 'Asha', 'beginner', 0], ['Python Projects', 'Meera', 'intermediate', 399],
]
const COURSES = T.map(([title, teacher, level, price], i) => ({ slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, ''), title, teacher, level, price, free: price === 0, lessonCount: 3 + (i * 7) % 10 }))
const log = (req) => fs.appendFileSync(new URL('./api.log', import.meta.url), `${Date.now()} ${req.method} ${req.url} ${req.headers['x-cap'] || '-'}\n`)

http.createServer((req, res) => {
  log(req)
  const url = new URL(req.url, 'http://localhost')
  const send = (code, body) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(body)) }
  const wait = fn => setTimeout(fn, 500)
  if (url.pathname === '/api/courses') {
    const q = url.searchParams
    if (!q.has('page')) return wait(() => send(200, COURSES))
    const page = Math.max(1, Number(q.get('page')) || 1), pageSize = Math.min(50, Math.max(1, Number(q.get('pageSize')) || 6))
    const totalPages = Math.ceil(COURSES.length / pageSize)
    return wait(() => send(200, { items: COURSES.slice((page - 1) * pageSize, page * pageSize), page, pageSize, total: COURSES.length, totalPages, nextPage: page < totalPages ? page + 1 : null }))
  }
  send(404, { error: 'not found' })
}).listen(8114, () => console.log('API on http://localhost:8114'))
