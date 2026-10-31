import { login } from './login.mjs'
import { ask, forge } from './tools.mjs'

const { accessToken } = await login()
await ask(accessToken)
await ask(forge(accessToken, { role: 'admin' }))
await new Promise(r => setTimeout(r, 11000))
await ask(accessToken)
