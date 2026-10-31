const SITE = 'http://localhost:5202'
const [email, password] = process.argv.slice(2)

const csrf = await fetch(SITE + '/api/auth/csrf')
const { csrfToken } = await csrf.json()
const res = await fetch(SITE + '/api/auth/callback/credentials', {
  method: 'POST',
  redirect: 'manual',
  headers: {
    cookie: cookiesOf(csrf),
    'content-type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({ csrfToken, email, password }),
})
show(res)

function cookiesOf(res) {
  return res.headers.getSetCookie().map(c => c.split(';')[0]).join('; ')
}
function show(res) {
  const where = new URL(res.headers.get('location'), SITE)
  console.log('status', res.status, '→', where.pathname + where.search)
  const set = res.headers.getSetCookie().find(c => c.startsWith('authjs.session-token='))
  if (!set) return
  const [kv, ...flags] = set.split(';'), value = kv.slice(kv.indexOf('=') + 1), parts = value.split('.')
  console.log('cookie  authjs.session-token ' + flags.join(';'))
  console.log('pieces ', parts.length, ' lengths', parts.map(p => p.length).join(' '))
  console.log('header ', Buffer.from(parts[0], 'base64url').toString().replace(/"kid":"[^"]*"/, '"kid":"…"'))
}
