// Exercise 10 - sort without breaking the original, and chaining
const courses = [
  { id: 1, title: 'React for Beginners', teacher: 'Meera', lessons: 12, price: 499, free: false },
  { id: 2, title: 'Python from Zero', teacher: 'Meera', lessons: 20, price: 0, free: true },
  { id: 3, title: 'System Design', teacher: 'Rahul', lessons: 25, price: 999, free: false },
  { id: 4, title: 'DevOps Basics', teacher: 'Asha', lessons: 15, price: 0, free: true },
];
const cheapestFirst = courses.toSorted((a, b) => a.price - b.price);
console.log(cheapestFirst.map((c) => c.title));
console.log('Original still starts with:', courses[0].title);

const mostLessonsFirst = courses.toSorted((a, b) => b.lessons - a.lessons);
console.log(mostLessonsFirst.map((c) => `${c.title} ${c.lessons}`));

// The surprise: sort changes the list it is called on
const pretend = [...courses];
const sorted = pretend.sort((a, b) => a.price - b.price);
console.log(sorted === pretend);
console.log(pretend[0].title);
console.log(courses[0].title);

// Without a callback, numbers sort as text
console.log([1, 10, 9].sort());
console.log([1, 10, 9].sort((a, b) => a - b));

// Chaining
const longOnes = courses.filter((c) => c.lessons > 15).map((c) => c.title);
console.log(longOnes);

const cheapestPaid = courses
  .filter((c) => c.price > 0)
  .toSorted((a, b) => a.price - b.price)[0];
console.log(cheapestPaid.title);
