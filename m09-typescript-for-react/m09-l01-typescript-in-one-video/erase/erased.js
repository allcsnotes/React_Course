"use strict";
const course = { title: 'React', price: 499 };
function formatPrice(price) {
    return 'Rs ' + price;
}
console.log(formatPrice(course.price));
