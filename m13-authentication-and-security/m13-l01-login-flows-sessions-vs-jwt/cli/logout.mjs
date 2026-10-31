import { login } from './login.mjs'

const API = 'http://localhost:8131/api'
const { accessToken, Cookie } = await login()
const call = async (path, init) => {
  const res = await fetch(API + path, init)
  console.log(path, res.status, await res.text())
}
const withCookie = { method: 'POST', headers: { Cookie } }
const bearer = { Authorization: `Bearer ${accessToken}` }
await call('/logout', withCookie)
await call('/me', { headers: bearer })
await call('/refresh', withCookie)
