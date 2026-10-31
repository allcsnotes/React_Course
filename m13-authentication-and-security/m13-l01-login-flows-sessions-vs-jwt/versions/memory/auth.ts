import { post } from './http'
import type { Creds } from './http'

let accessToken = ''
const authed = (path: string) =>
  fetch(path, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

export async function login(creds: Creds) {
  const res = await post('/api/login', creds)
  if (!res.ok) throw new Error('Sign in failed')
  accessToken = (await res.json()).accessToken
}

export async function whoAmI() {
  if (!accessToken) return null
  const res = await authed('/api/me')
  return res.ok ? await res.json() : null
}

export async function loadCourses() {
  const res = await authed('/api/my-courses')
  if (!res.ok) throw new Error((await res.json()).detail)
  return res.json()
}

export async function logout() {
  accessToken = ''
}
