import { z } from 'zod'
import { CoursesSchema } from './schema'

async function getJson<T>(
  url: string,
  schema: z.ZodType<T>,
) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Server answered ${res.status}`)
  return schema.parse(await res.json())
}

export const getCourses = () => getJson('/api/courses', CoursesSchema)
