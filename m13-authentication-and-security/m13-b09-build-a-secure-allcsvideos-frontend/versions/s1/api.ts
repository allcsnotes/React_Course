import { z } from 'zod'
import { CoursesSchema } from './schema.ts'
import { getToken } from './tokens.ts'

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

export const getMyCourses = () =>
  request('/api/me/courses', CoursesSchema)
