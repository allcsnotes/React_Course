import { CoursesSchema } from './schema.ts'

const res = await fetch('http://localhost:8195/api/courses')
const result = CoursesSchema.safeParse(await res.json())

if (!result.success) {
  console.log(result.error.issues[0])
}
