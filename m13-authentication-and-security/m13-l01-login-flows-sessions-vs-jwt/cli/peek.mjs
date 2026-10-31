import { login } from './login.mjs'

const { accessToken } = await login()
const [head, body, sig] = accessToken.split('.')
const read = s => JSON.parse(Buffer.from(s, 'base64url'))
console.log(read(head))
console.log(read(body))
console.log('signature:', sig.length, 'characters')
