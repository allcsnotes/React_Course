// Exercise 11 - Split the code into modules
// This file is main.js of the exercise. It needs courses.js and helpers/price.js next to it.
import courses from './courses.js';
import { formatPrice, withGst, totalPrice as sumOfPrices } from './helpers/price.js';

console.log(courses[0].title);
console.log(formatPrice(courses[0].price));
console.log(formatPrice(withGst(courses[0].price)));
console.log(formatPrice(sumOfPrices(courses)));

// A default import can have any name:
import allCourses from './courses.js';
console.log(allCourses.length);
