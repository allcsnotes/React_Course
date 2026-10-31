import { courseSchema } from '../src/schema.ts'

const typed = { title: '  React Basics ', price: 0, level: 'beginner', description: '' }
const result = courseSchema.safeParse(typed)
console.log(result.success && result.data)
