import { z } from 'zod'
import { MyCoursesSchema } from './schema.ts'

async function getJson<T>(
  url: string,
  schema: z.ZodType<T>,
  init?: RequestInit,
) {
  const res = await fetch(url, init)
  if (!res.ok) throw new Error(`Server answered ${res.status}`)
  const result = schema.safeParse(await res.json())
  if (!result.success) {
    const { path, message } = result.error.issues[0]
    throw new Error(`Bad data at ${path.join('.')}: ${message}`)
  }
  return result.data
}

export const getMyCourses = () =>
  getJson('/api/me/courses', MyCoursesSchema)
