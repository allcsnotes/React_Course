import { post } from './http'
import type { Creds } from './http'

export async function login(creds: Creds) {
  const res = await post('/api/session/login', creds)
  if (!res.ok) throw new Error('Sign in failed')
}

export async function whoAmI() {
  const res = await fetch('/api/session/me')
  return res.ok ? await res.json() : null
}

export async function loadCourses() {
  const res = await fetch('/api/session/my-courses')
  if (!res.ok) throw new Error((await res.json()).detail)
  return res.json()
}

export async function logout() {
  await fetch('/api/session/logout', { method: 'POST' })
}
