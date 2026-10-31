const courses = [
  { id: 1, title: 'React for Beginners', teacher: 'Meera', lessons: 12, price: 499, free: false },
  { id: 2, title: 'Python from Zero', teacher: 'Meera', lessons: 20, price: 0, free: true },
  { id: 3, title: 'System Design', teacher: 'Rahul', lessons: 25, price: 999, free: false },
  { id: 4, title: 'DevOps Basics', teacher: 'Asha', lessons: 15, price: 0, free: true },
];
const next = { id: 5, title: 'Git Basics', teacher: 'Asha', lessons: 8, price: 0, free: true };
const more = [...courses, next];
const both = [...courses, ...more];
console.log(courses.length, more.length, both.length);
