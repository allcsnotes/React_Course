import { z } from 'zod'
import { CoursesSchema } from './schema'

async function getJson<T>(
  url: string,
  schema: z.ZodType<T>,
) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Server answered ${res.status}`)
  const result = schema.safeParse(await res.json())
  if (!result.success) {
    const { path, message } = result.error.issues[0]
    throw new Error(`Bad data at ${path.join('.')}: ${message}`)
  }
  return result.data
}

export const getCourses = () => getJson('/api/courses', CoursesSchema)
