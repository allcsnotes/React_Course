import { z } from 'zod'
import { CoursesSchema } from './schema.ts'

const res = await fetch('http://localhost:8195/api/courses')
const json = await res.json()

try {
  const courses = CoursesSchema.parse(json)
  console.log('parse worked:', courses.length, 'courses')
} catch (err) {
  if (err instanceof z.ZodError) {
    console.log(err.name, err.issues.length)
  }
}
