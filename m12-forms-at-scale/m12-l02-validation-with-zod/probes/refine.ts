import { courseSchema } from '../src/schema.ts'

const paid = { title: 'React Basics', price: 499, level: 'beginner', description: '' }
const a = courseSchema.safeParse(paid)
console.log('only the description is missing:', a.success ? 'ok' : a.error.issues.map(i => i.path + ' -> ' + i.message))

const b = courseSchema.safeParse({ ...paid, title: 'Go' })
console.log('the title is short as well:', b.success ? 'ok' : b.error.issues.map(i => i.path + ' -> ' + i.message))
