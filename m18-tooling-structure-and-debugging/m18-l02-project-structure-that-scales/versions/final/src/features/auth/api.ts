import { request, setToken } from '@/shared/api/client'
import type { User } from './types'

export async function login(email: string, password: string) {
  const session = await request<{ accessToken: string; user: User }>(
    '/api/auth/login',
    { method: 'POST', body: JSON.stringify({ email, password }) },
  )
  setToken(session.accessToken)
  return session.user
}

export function logout() {
  setToken(null)
}
