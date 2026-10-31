import { z } from 'zod'
import { CoursesSchema, SessionSchema } from './schema.ts'
import type { User } from './schema.ts'
import { getToken, setToken } from './tokens.ts'

export class ApiError extends Error {
  status: number
  fields?: Record<string, string>
  constructor(
    status: number,
    message: string,
    fields?: Record<string, string>,
  ) {
    super(message)
    this.status = status
    this.fields = fields
  }
}

export async function request<T>(
  url: string,
  schema: z.ZodType<T>,
  init: RequestInit = {},
) {
  const headers = new Headers(init.headers)
  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (init.body) headers.set('Content-Type', 'application/json')
  const res = await fetch(url, { ...init, headers })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(
      res.status,
      body.error ?? `Server answered ${res.status}`,
      body.fields,
    )
  }
  return schema.parse(await res.json())
}

const post = (body: unknown): RequestInit => ({
  method: 'POST',
  body: JSON.stringify(body),
})

type Session = z.infer<typeof SessionSchema>

async function startSession(answer: Promise<Session>) {
  const session = await answer
  setToken(session.accessToken)
  return session.user
}

const authPost = (path: string, body: object) =>
  startSession(request(path, SessionSchema, post(body)))

export type Credentials = { email: string; password: string }

export const login = (body: Credentials) =>
  authPost('/api/auth/login', body)

export const signup = (body: Credentials & { name: string }) =>
  authPost('/api/auth/signup', body)

let pending: Promise<User> | null = null

export function refresh() {
  pending ??= startSession(
    request('/api/auth/refresh', SessionSchema, { method: 'POST' }),
  ).finally(() => {
    pending = null
  })
  return pending
}

export async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' })
  setToken(null)
}

export const getMyCourses = () =>
  request('/api/me/courses', CoursesSchema)
