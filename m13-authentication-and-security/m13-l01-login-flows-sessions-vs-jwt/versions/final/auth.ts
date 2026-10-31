import { post } from './http'
import type { Creds } from './http'

let accessToken = ''
let pending: Promise<boolean> | null = null

async function askForNewToken() {
  const res = await fetch('/api/refresh', {
    method: 'POST',
  })
  if (!res.ok) return false
  accessToken = (await res.json()).accessToken
  return true
}

export function refresh() {
  pending ??= askForNewToken().finally(() => {
    pending = null
  })
  return pending
}

export async function api(path: string) {
  const send = () =>
    fetch(path, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  let res = await send()
  if (res.status === 401 && (await refresh())) {
    res = await send()
  }
  return res
}

export async function login(creds: Creds) {
  const res = await post('/api/login', creds)
  if (!res.ok) throw new Error('Sign in failed')
  accessToken = (await res.json()).accessToken
}

export async function whoAmI() {
  if (!accessToken && !(await refresh())) return null
  const res = await api('/api/me')
  return res.ok ? await res.json() : null
}

export async function loadCourses() {
  const res = await api('/api/my-courses')
  if (!res.ok) throw new Error((await res.json()).detail)
  return res.json()
}

export async function logout() {
  await fetch('/api/logout', { method: 'POST' })
  accessToken = ''
}
