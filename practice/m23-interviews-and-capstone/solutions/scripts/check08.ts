// Run with: node scripts/check08.ts
import assert from 'node:assert/strict'
import { COURSES, filterCourses } from '../src/lib/courses.ts'

const titles = (l: typeof COURSES) => l.map((c) => c.title)
console.log('"react":', titles(filterCourses(COURSES, 'react', 'none')))
assert.deepEqual(titles(filterCourses(COURSES, '  REACT ', 'none')), ['React for Beginners', 'Testing React Apps'])
assert.deepEqual(filterCourses(COURSES, 'zzz', 'none'), [])
assert.equal(filterCourses(COURSES, '', 'none').length, 8)
const asc = filterCourses(COURSES, '', 'asc').map((c) => c.price)
console.log('price asc:', asc)
assert.deepEqual(asc, [299, 349, 399, 499, 549, 599, 649, 999])
assert.equal(COURSES[0].id, 1) // the original order is not changed by sorting
console.log('filter: all checks passed')
