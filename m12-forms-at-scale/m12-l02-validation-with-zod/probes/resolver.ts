import { zodResolver } from '@hookform/resolvers/zod'
import { courseSchema } from '../src/schema.ts'

const values = {
  title: 'React Basics',
  price: 499,
  level: 'beginner',
  description: '',
}
const options = { fields: {}, shouldUseNativeValidation: false }

const check = zodResolver(courseSchema)
const out = await check(values, undefined, options)
console.log(JSON.stringify(out.errors))
