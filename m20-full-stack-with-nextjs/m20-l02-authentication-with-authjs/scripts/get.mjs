// usage: node get.mjs <email> <password> <path> : signs in over HTTP (like peek.mjs), then GETs <path> with the cookie and prints the status
const SITE = 'http://localhost:5202'
const jar = {}
const keep = res => { for (const c of res.headers.getSetCookie()) { const [kv] = c.split(';'); const i = kv.indexOf('='); jar[kv.slice(0, i)] = kv.slice(i + 1) } }
const cookie = () => Object.entries(jar).map(([k, v]) => k + '=' + v).join('; ')
const csrf = await fetch(SITE + '/api/auth/csrf'); keep(csrf)
const { csrfToken } = await csrf.json()
if (process.argv[2] !== '-') {
  const res = await fetch(SITE + '/api/auth/callback/credentials', { method: 'POST', redirect: 'manual', headers: { 'content-type': 'application/x-www-form-urlencoded', cookie: cookie() }, body: new URLSearchParams({ csrfToken, email: process.argv[2], password: process.argv[3] }) })
  keep(res)
}
const r = await fetch(SITE + process.argv[4], { redirect: 'manual', headers: { cookie: cookie() } })
console.log('GET', process.argv[4], '→ status', r.status, r.headers.get('location') ? '→ ' + r.headers.get('location').replace(SITE, '') : '')
