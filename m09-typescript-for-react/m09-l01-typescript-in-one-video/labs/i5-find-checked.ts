import { courses } from './data.ts'

const found = courses.find(c => c.id === 3)

if (found) {
  console.log(found.title)
}
