import allCourses from './courses.js'
import { formatPrice as money, totalPrice } from './price.js'

console.log(allCourses[0].title)
console.log(money(allCourses[0].price))
console.log(money(totalPrice(allCourses)))
