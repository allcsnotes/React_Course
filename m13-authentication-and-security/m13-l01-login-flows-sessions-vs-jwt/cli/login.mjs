export async function login() {
  const body = JSON.stringify({ email: 'lukas@example.com', password: 'pass1234' })
  const res = await fetch('http://localhost:8131/api/login', { method: 'POST', body })
  const Cookie = res.headers.get('set-cookie').split(';')[0]
  return { ...(await res.json()), Cookie }
}
