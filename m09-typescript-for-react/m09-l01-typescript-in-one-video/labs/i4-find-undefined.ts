import { courses } from './data.ts'

const found = courses.find(c => c.id === 3)

console.log(found.title)
