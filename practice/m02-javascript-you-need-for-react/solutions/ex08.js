// Exercise 08 - filter, find, some and every
const courses = [
  { id: 1, title: 'React for Beginners', teacher: 'Meera', lessons: 12, price: 499, free: false },
  { id: 2, title: 'Python from Zero', teacher: 'Meera', lessons: 20, price: 0, free: true },
  { id: 3, title: 'System Design', teacher: 'Rahul', lessons: 25, price: 999, free: false },
  { id: 4, title: 'DevOps Basics', teacher: 'Asha', lessons: 15, price: 0, free: true },
];
const free = courses.filter((c) => c.free);
console.log(free.length, free.map((c) => c.title));

const expensive = courses.filter((c) => c.price > 500);
console.log(expensive.map((c) => c.title));

const huge = courses.filter((c) => c.lessons > 100);
console.log(huge);

const three = courses.find((c) => c.id === 3);
console.log(three.title);

const missing = courses.find((c) => c.id === 99);
console.log(missing);

console.log(courses.some((c) => c.free));
console.log(courses.every((c) => c.free));
console.log(courses.every((c) => c.lessons > 10));

// The trap: find gave back nothing, then we ask it for something.
// Remove the slashes, run again, and read the error.
// console.log(missing.title);
