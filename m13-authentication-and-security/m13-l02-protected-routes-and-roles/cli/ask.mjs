// usage: node ask.mjs <path> [who]   signs in as <who> (practice sign-in), then asks the practice API; prints status and the first 66 characters
const [path, who] = process.argv.slice(2)
const API = 'http://localhost:8132'
let headers = {}
if (who) {
  const r = await fetch(API + '/api/login', { method: 'POST', body: JSON.stringify({ email: who + '@example.com' }) })
  headers = { Authorization: 'Bearer ' + (await r.json()).token }
}
const res = await fetch(API + path, { headers })
const text = await res.text()
console.log(res.status, text.length > 66 ? text.slice(0, 66) + '...' : text)
