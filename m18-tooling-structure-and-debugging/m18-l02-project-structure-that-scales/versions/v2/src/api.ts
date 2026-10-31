import type { Course, MyCourse, User } from './types'

let token: string | null = null

const url = (path: string) =>
  new URL(path, window.location.origin).href

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (init.body) headers.set('Content-Type', 'application/json')
  const res = await fetch(url(path), { ...init, headers })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(
      res.status,
      body.error ?? `Server answered ${res.status}`,
    )
  }
  return res.json()
}

export const getCourses = () => request<Course[]>('/api/courses')

export const getMyCourses = () =>
  request<MyCourse[]>('/api/me/courses')

export async function login(email: string, password: string) {
  const session = await request<{ accessToken: string; user: User }>(
    '/api/auth/login',
    { method: 'POST', body: JSON.stringify({ email, password }) },
  )
  token = session.accessToken
  return session.user
}

export function logout() {
  token = null
}
