// The practice A P I for module 18, lesson 3 (port 8183).
//   GET /api/cart -> the cart: two items; the price of each item is sent as TEXT (on purpose: this is the bug the lesson hunts)
// CORS is open so the page on another port may call it. Every answer takes a real 600 ms.
import http from 'node:http'

const CART = { items: [
  { slug: 'react-for-beginners', title: 'React for Beginners', price: '499' },
  { slug: 'sql-in-two-weeks', title: 'SQL in Two Weeks', price: '399' },
] }

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const send = (code, body) => { res.writeHead(code, { 'content-type': 'application/json', 'access-control-allow-origin': '*' }); res.end(JSON.stringify(body)) }
  if (url.pathname === '/api/cart') return setTimeout(() => send(200, CART), 600)
  send(404, { error: 'not found' })
}).listen(8183, () => console.log('API on http://localhost:8183'))
