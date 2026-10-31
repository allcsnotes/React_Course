import courses from './courses.js'
import { formatPrice, totalPrice } from './price.js'

console.log(courses[0].title)
console.log(formatPrice(courses[0].price))
console.log(formatPrice(totalPrice(courses)))
