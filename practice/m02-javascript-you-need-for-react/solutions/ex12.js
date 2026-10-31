// Exercise 12 - The fixed imports
import courses from './courses.js';
import { formatPrice } from './helpers/price.js';

console.log(courses[2].title);
console.log(formatPrice(courses[2].price));
