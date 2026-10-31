import { courseSchema } from '../src/schema.ts'

const form = { title: 'Go', price: NaN, level: 'expert', description: '' }
const result = courseSchema.safeParse(form)

if (!result.success) {
  for (const issue of result.error.issues) {
    console.log(issue.path.join('.') + ':', issue.message)
  }
}
