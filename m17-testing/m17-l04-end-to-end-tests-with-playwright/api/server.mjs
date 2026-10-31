// The practice API for the e2e lesson (port 8174). Every answer takes a real 600 ms.
//   GET  /api/courses  -> the courses      POST /api/orders {slugs, coupon} -> {id, total}
//   GET  /api/orders   -> all orders       POST /api/reset  -> forget all orders
import http from 'node:http'

const COURSES = [
  { slug: 'react-for-beginners', title: 'React for Beginners', teacher: 'Meera', price: 499 },
  { slug: 'python-from-zero', title: 'Python from Zero', teacher: 'Meera', price: 0 },
  { slug: 'sql-in-two-weeks', title: 'SQL in Two Weeks', teacher: 'Asha', price: 399 },
  { slug: 'docker-for-developers', title: 'Docker for Developers', teacher: 'Rahul', price: 599 },
]
const COUPONS = { SAVE10: { percent: 10 }, FLAT200: { flat: 200 } }
let orders = []

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const send = (code, body) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(body)) }
  const wait = fn => setTimeout(fn, 600)
  let raw = ''
  req.on('data', c => raw += c)
  req.on('end', () => {
    if (req.method === 'GET' && url.pathname === '/api/courses') return wait(() => send(200, COURSES))
    if (req.method === 'GET' && url.pathname === '/api/orders') return send(200, orders)
    if (req.method === 'POST' && url.pathname === '/api/reset') { orders = []; return send(200, { ok: true }) }
    if (req.method === 'POST' && url.pathname === '/api/orders') {
      const { slugs = [], coupon = '' } = JSON.parse(raw || '{}')
      const items = COURSES.filter(c => slugs.includes(c.slug))
      const sub = items.reduce((s, c) => s + c.price, 0), cp = COUPONS[coupon]
      const off = cp ? Math.min(sub, cp.percent ? Math.round(sub * cp.percent / 100) : cp.flat) : 0
      const order = { id: 'ord-' + (orders.length + 1), courses: items.length, total: sub - off }
      return wait(() => { orders.push(order); send(201, order) })
    }
    send(404, { error: 'not found' })
  })
}).listen(8174, () => console.log('API on http://localhost:8174'))
