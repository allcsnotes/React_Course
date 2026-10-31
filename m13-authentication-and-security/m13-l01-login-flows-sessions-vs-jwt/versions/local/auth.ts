import { post } from './http'
import type { Creds } from './http'

const getToken = () =>
  localStorage.getItem('token') ?? ''
const authed = (path: string) =>
  fetch(path, {
    headers: { Authorization: `Bearer ${getToken()}` },
  })

export async function login(creds: Creds) {
  const res = await post('/api/login', creds)
  if (!res.ok) throw new Error('Sign in failed')
  const { accessToken } = await res.json()
  localStorage.setItem('token', accessToken)
}

export async function whoAmI() {
  if (!getToken()) return null
  const res = await authed('/api/me')
  return res.ok ? await res.json() : null
}

export async function loadCourses() {
  const res = await authed('/api/my-courses')
  if (!res.ok) throw new Error((await res.json()).detail)
  return res.json()
}

export async function logout() {
  localStorage.removeItem('token')
}
