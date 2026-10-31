import { CourseSchema } from './schema.ts'

export async function getCourse() {
  const res = await fetch('/api/instructor/course')
  if (!res.ok)
    throw new Error(`Server answered ${res.status}`)
  return CourseSchema.parse(await res.json())
}
