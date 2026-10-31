import type { Course } from './types.ts'

const text = '{"title":"React","price":"free"}'
const course = JSON.parse(text) as Course

console.log(course.price + 1)
