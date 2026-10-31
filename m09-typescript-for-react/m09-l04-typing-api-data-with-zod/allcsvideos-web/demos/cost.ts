import { CoursesSchema } from './schema.ts'

const res = await fetch('http://localhost:8195/api/courses')
const json = await res.json()

const runs = 10000
const start = performance.now()
for (let i = 0; i < runs; i++) CoursesSchema.parse(json)
const each = ((performance.now() - start) / runs) * 1000
console.log(`8 courses checked ${runs} times: ${each.toFixed(1)} microseconds each`)
