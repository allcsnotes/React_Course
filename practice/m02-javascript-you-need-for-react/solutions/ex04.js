// Exercise 04 - Predict the output (objects and arrays)
const courses = [
  { id: 1, title: 'React for Beginners', teacher: 'Meera', lessons: 12, price: 499, free: false },
  { id: 2, title: 'Python from Zero', teacher: 'Meera', lessons: 20, price: 0, free: true },
  { id: 3, title: 'System Design', teacher: 'Rahul', lessons: 25, price: 999, free: false },
  { id: 4, title: 'DevOps Basics', teacher: 'Asha', lessons: 15, price: 0, free: true },
];
const course = courses[0];

console.log(course.title);
console.log(course.rating);

course.price = 399;
course.rating = 4.8;
console.log(course.price, course.rating);

console.log(courses[2].teacher);
console.log(courses.length);
console.log(courses[courses.length - 1].title);
console.log(courses[10]);
console.log(courses[1].title, courses[1].free);

// Now remove the two slashes in front of the next line, run again, and read the error.
// console.log(courses[10].title);
