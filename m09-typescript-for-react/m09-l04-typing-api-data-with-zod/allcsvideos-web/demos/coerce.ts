import { z } from 'zod'

const Price = z.coerce.number()

console.log(Price.parse('499'))
console.log(Price.safeParse('abc').success)
console.log(Price.parse(''))
console.log(Price.parse(null))
