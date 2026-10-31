import { courses } from './courses.js'

let calls = 0

// pretends to be a slow server: the first call fails, the second works
export function fakeFetch() {
  calls = calls + 1
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (calls === 1) reject(new Error('offline'))
      else resolve(courses.slice(0, 3))
    }, 900)
  })
}
