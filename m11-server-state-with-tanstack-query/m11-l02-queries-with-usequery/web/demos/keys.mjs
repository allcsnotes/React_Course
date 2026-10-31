import { hashKey } from '@tanstack/query-core'

const a = ['courses', { level: 'beginner', free: true }]
const b = ['courses', { free: true, level: 'beginner' }]
const c = ['courses', { level: 'advanced', free: true }]

console.log(hashKey(a))
console.log('a and b, same box?', hashKey(a) === hashKey(b))
console.log('a and c, same box?', hashKey(a) === hashKey(c))
