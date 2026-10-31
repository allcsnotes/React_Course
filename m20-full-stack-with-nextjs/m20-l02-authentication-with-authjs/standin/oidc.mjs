// LOCAL STAND-IN for "Sign in with Google": a tiny OpenID Connect provider on port 8202. It is NOT Google.
import http from 'node:http'
import crypto from 'node:crypto'
import { createRequire } from 'node:module'
const require = createRequire(new URL('../package.json', import.meta.url))
const { SignJWT, exportJWK, generateKeyPair } = await import(require.resolve('jose'))
const ISS = 'http://localhost:8202'
const { publicKey, privateKey } = await generateKeyPair('RS256')
const jwk = { ...(await exportJWK(publicKey)), kid: 'standin-1', alg: 'RS256', use: 'sig' }
const codes = new Map()
const json = (res, o) => { res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify(o)) }
const page = body => `<!doctype html><meta charset="utf-8"><title>Local stand-in</title><style>
body{font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:#f3f5f9;color:#14213d;margin:0}
.top{height:38px;background:#3a3f4d;color:#fff;display:flex;align-items:center;padding:0 22px;font-weight:700;font-size:18px}
.card{background:#fff;border:1px solid #d5dbe8;border-radius:12px;padding:14px 18px;margin:14px 22px}
h1{font-size:26px;margin:0 0 6px}p{font-size:18px;margin:6px 0}button{font:inherit;font-size:18px;font-weight:700;margin-top:10px;padding:8px 16px;border:0;border-radius:8px;background:#1a5fd0;color:#fff;cursor:pointer}
.tag{display:inline-block;font-size:15px;font-weight:700;color:#b3470f;border:1.5px solid #b3470f;border-radius:999px;padding:0 10px}</style>
<div class="top">Local stand-in provider</div>${body}`
http.createServer(async (req, res) => {
  const u = new URL(req.url, ISS); if (u.pathname !== '/jwks' && !u.pathname.startsWith('/.well') && u.pathname !== '/favicon.ico') console.log(req.method, u.pathname)
  if (u.pathname === '/.well-known/openid-configuration') return json(res, { issuer: ISS, authorization_endpoint: ISS + '/authorize', token_endpoint: ISS + '/token', userinfo_endpoint: ISS + '/userinfo', jwks_uri: ISS + '/jwks', response_types_supported: ['code'], subject_types_supported: ['public'], id_token_signing_alg_values_supported: ['RS256'], code_challenge_methods_supported: ['S256'], token_endpoint_auth_methods_supported: ['client_secret_basic', 'client_secret_post'] })
  if (u.pathname === '/jwks') return json(res, { keys: [jwk] })
  if (u.pathname === '/authorize') {
    const q = Object.fromEntries(u.searchParams)
    res.writeHead(200, { 'content-type': 'text/html' })
    return res.end(page(`<div class="card"><span class="tag">not Google, a local stand-in</span><h1>Choose an account</h1><p>The site <b>localhost:5202</b> wants to know who you are.</p>
      <form method="get" action="/approve">${['state', 'redirect_uri', 'code_challenge', 'nonce', 'client_id'].map(k => `<input type="hidden" name="${k}" value="${(q[k] || '').replace(/"/g, '&quot;')}">`).join('')}
      <button>Continue as Test Person</button></form></div>`))
  }
  if (u.pathname === '/approve') {
    const q = Object.fromEntries(u.searchParams); const code = crypto.randomBytes(12).toString('hex')
    codes.set(code, { nonce: q.nonce, challenge: q.code_challenge, client_id: q.client_id })
    const back = new URL(q.redirect_uri); back.searchParams.set('code', code); back.searchParams.set('state', q.state); back.searchParams.set('iss', ISS)
    console.log('  → 302 ' + back.pathname + '?code=' + code.slice(0, 6) + '…'); res.writeHead(302, { location: back.toString() }); return res.end()
  }
  if (u.pathname === '/token' && req.method === 'POST') {
    let body = ''; for await (const c of req) body += c; const f = new URLSearchParams(body); const rec = codes.get(f.get('code'))
    if (!rec) { res.writeHead(400, { 'content-type': 'application/json' }); return res.end(JSON.stringify({ error: 'invalid_grant' })) }
    codes.delete(f.get('code'))
    const idt = await new SignJWT({ name: 'Test Person', email: 'test.person@example.com', email_verified: true, ...(rec.nonce ? { nonce: rec.nonce } : {}) }).setProtectedHeader({ alg: 'RS256', kid: 'standin-1' }).setIssuer(ISS).setSubject('standin-user-1').setAudience(rec.client_id).setIssuedAt().setExpirationTime('10m').sign(privateKey)
    console.log('  code ok → id_token (test.person@…)'); return json(res, { access_token: 'standin-access-' + crypto.randomBytes(6).toString('hex'), token_type: 'bearer', expires_in: 600, id_token: idt })
  }
  if (u.pathname === '/userinfo') return json(res, { sub: 'standin-user-1', name: 'Test Person', email: 'test.person@example.com' })
  res.writeHead(404); res.end('no')
}).listen(8202, () => console.log('stand-in OIDC provider on 8202'))
