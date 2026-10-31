// The practice A P I for the test suite build (module 17, build 12). A local stand-in, not the production server.
//   GET  /api/courses        -> the catalog
//   POST /api/auth/login     {email,password} -> 200 {accessToken,user} | 401 {error}
//   GET  /api/me/courses     -> needs a Bearer token
import http from 'node:http'
import crypto from 'node:crypto'

const PORT = Number(process.env.PORT || 8170)
const COURSES = [
  { slug: 'react-for-beginners', title: 'React for Beginners', teacher: 'Meera', level: 'beginner', price: 499, lessonCount: 4 },
  { slug: 'python-from-zero', title: 'Python from Zero', teacher: 'Meera', level: 'beginner', price: 0, lessonCount: 3 },
  { slug: 'sql-in-two-weeks', title: 'SQL in Two Weeks', teacher: 'Asha', level: 'intermediate', price: 399, lessonCount: 3 },
  { slug: 'docker-for-developers', title: 'Docker for Developers', teacher: 'Rahul', level: 'intermediate', price: 599, lessonCount: 3 },
].map((c) => ({ ...c, free: c.price === 0 }))
const MINE = [
  { slug: 'react-for-beginners', title: 'React for Beginners', teacher: 'Meera', lessonCount: 4, completedCount: 2 },
  { slug: 'python-from-zero', title: 'Python from Zero', teacher: 'Meera', lessonCount: 3, completedCount: 3 },
]
const USER = { id: 1, name: 'Lukas', email: 'lukas@example.com', role: 'student' }
const PASSWORD = 'learn-fast-42'
const tokens = new Set()
const t0 = Date.now()
const stamp = () => '+' + ((Date.now() - t0) / 1000).toFixed(1).padStart(5, ' ') + 's'

http
  .createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost')
    let body = ''
    req.on('data', (c) => (body += c))
    req.on('end', () => {
      const send = (code, obj) => {
        setTimeout(() => {
          console.log(`${stamp()} ${req.method.padEnd(5)} ${url.pathname.padEnd(18)} ${code}`)
          res.writeHead(code, { 'content-type': 'application/json' })
          res.end(JSON.stringify(obj))
        }, 120)
      }
      const route = `${req.method} ${url.pathname}`
      if (route === 'GET /api/courses') return send(200, COURSES)
      if (route === 'POST /api/auth/login') {
        let b = {}
        try { b = JSON.parse(body || '{}') } catch { /* empty */ }
        if (b.email !== USER.email || b.password !== PASSWORD) return send(401, { error: 'Wrong email or password' })
        const accessToken = crypto.randomBytes(16).toString('hex')
        tokens.add(accessToken)
        return send(200, { accessToken, user: USER })
      }
      if (route === 'GET /api/me/courses') {
        const h = req.headers.authorization || ''
        if (!tokens.has(h.slice(7))) return send(401, { error: 'Not signed in' })
        return send(200, MINE)
      }
      send(404, { error: 'not found' })
    })
  })
  .listen(PORT, () => console.log(`Practice API on http://localhost:${PORT}`))
