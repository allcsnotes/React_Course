// Exercise 06 - Spread, and the banner bug
// Part 1: the bug. The equals sign gives the SAME object a second name.
const original = { id: 1, title: 'React for Beginners', teacher: 'Meera', lessons: 12, price: 499, free: false };
const alias = original;
alias.price = 0;
console.log('Alias price:', alias.price);
console.log('Original price:', original.price);

// Part 2: the fix. Spread makes a real copy.
const course = { id: 1, title: 'React for Beginners', teacher: 'Meera', lessons: 12, price: 499, free: false };
const banner = { ...course, price: 0 };
console.log('Banner price:', banner.price);
console.log('Course price:', course.price);

// Part 3: order matters. Later keys win.
const good = { ...course, price: 1 };
const wrong = { price: 1, ...course };
console.log('Spread first:', good.price);
console.log('Spread last:', wrong.price);

// Part 4: spread with arrays
const courses = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
const next = { id: 5 };
const more = [...courses, next];
const extra = [{ id: 6 }, { id: 7 }];
const both = [...courses, ...extra];
console.log(courses.length, more.length, both.length);

// Part 5: spread copies ONE level only
const copy = [...courses];
copy[0].id = 99;
console.log(courses[0].id);
