// A small stand-in for the allcsvideos API (module 13, lesson 2): sign-in, tokens and role checks.
//   POST /api/login           {email}   -> { token, user }   (practice sign-in: no password, see module 13 lesson 1 for the real one)
//   GET  /api/courses                   -> public list
//   GET  /api/my-courses                -> any signed-in user
//   GET  /api/studio/courses            -> instructor or admin
//   GET  /api/admin/users               -> admin only
// 401 = no (or unknown) token. 403 = known user, wrong role. mode.txt: "strict" (checks roles) or "open" (checks nothing).
import http from 'node:http'
import fs from 'node:fs'
import crypto from 'node:crypto'

const USERS = [
  { id: 1, name: 'Lukas', email: 'lukas@example.com', role: 'student' },
  { id: 2, name: 'Meera', email: 'meera@example.com', role: 'instructor' },
  { id: 3, name: 'Asha', email: 'asha@example.com', role: 'admin' },
  { id: 4, name: 'Priya', email: 'priya@example.com', role: 'student' },
]
const COURSES = [
  { slug: 'react-for-beginners', title: 'React for Beginners', teacher: 'Meera', students: 412 },
  { slug: 'python-from-zero', title: 'Python from Zero', teacher: 'Meera', students: 1280 },
  { slug: 'devops-basics', title: 'DevOps Basics', teacher: 'Asha', students: 655 },
]
const ENROLLED = { 1: ['react-for-beginners', 'python-from-zero'], 4: ['devops-basics'], 2: [], 3: [] }
const tokens = new Map()
const mode = () => { try { return fs.readFileSync(new URL('./mode.txt', import.meta.url), 'utf8').trim() } catch { return 'strict' } }

function userFor(req) {
  const h = req.headers.authorization || ''
  const t = h.startsWith('Bearer ') ? h.slice(7) : ''
  return tokens.get(t) || null
}
// role check: null when allowed, else [status, body]
function check(req, roles) {
  if (mode() === 'open') return null
  const user = userFor(req)
  if (!user) return [401, { error: 'not signed in' }]
  if (!roles.includes(user.role)) {
    return [403, { error: 'forbidden', needs: roles }]
  }
  return null
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const send = (code, body) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(body)) }
  const wait = fn => setTimeout(fn, 250)
  const gate = (roles, body) => { const bad = check(req, roles); if (bad) return wait(() => send(...bad)); const u = userFor(req); return wait(() => send(200, body(u))) }
  if (url.pathname === '/api/login' && req.method === 'POST') {
    let raw = ''; req.on('data', c => { raw += c }); req.on('end', () => {
      let b = {}; try { b = JSON.parse(raw) } catch {}
      const u = USERS.find(x => x.email === b.email)       // the role comes from OUR table, never from the request
      if (!u) return wait(() => send(401, { error: 'unknown email' }))
      const token = 'tok_' + crypto.randomBytes(8).toString('hex'); tokens.set(token, u)
      wait(() => send(200, { token, user: { id: u.id, name: u.name, role: u.role } }))
    }); return
  }
  if (url.pathname === '/api/courses') return wait(() => send(200, COURSES.map(({ slug, title, teacher }) => ({ slug, title, teacher }))))
  if (url.pathname === '/api/my-courses') return gate(['student', 'instructor', 'admin'], u => COURSES.filter(c => (ENROLLED[(u || USERS[0]).id] || []).includes(c.slug)))
  if (url.pathname === '/api/studio/courses') return gate(['instructor', 'admin'], u => COURSES.filter(c => !u || u.role === 'admin' || c.teacher === u.name))
  if (url.pathname === '/api/admin/users') return gate(['admin'], () => USERS)
  send(404, { error: 'not found' })
}).listen(8132, () => console.log('practice API on http://localhost:8132'))
