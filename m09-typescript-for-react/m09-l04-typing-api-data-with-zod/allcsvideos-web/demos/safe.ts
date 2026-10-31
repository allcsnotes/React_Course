import { CoursesSchema } from './schema.ts'
import { z } from 'zod'

const res = await fetch('http://localhost:8195/api/courses')
const json = await res.json()
const result = CoursesSchema.safeParse(json)

console.log('success:', result.success)
if (result.success) {
  console.log('first title:', result.data[0].title)
} else {
  console.log(z.prettifyError(result.error))
}
