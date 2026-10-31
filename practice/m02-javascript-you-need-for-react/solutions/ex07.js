// Exercise 07 - From a list to a new list with map
const courses = [
  { id: 1, title: 'React for Beginners', teacher: 'Meera', lessons: 12, price: 499, free: false },
  { id: 2, title: 'Python from Zero', teacher: 'Meera', lessons: 20, price: 0, free: true },
  { id: 3, title: 'System Design', teacher: 'Rahul', lessons: 25, price: 999, free: false },
  { id: 4, title: 'DevOps Basics', teacher: 'Asha', lessons: 15, price: 0, free: true },
];
// 1) The slow way: for...of and push
const titles = [];
for (const course of courses) {
  titles.push(course.title);
}
console.log(titles);

// 2) The same with map
const titles2 = courses.map((c) => c.title);
console.log(titles2);

// 3) Prices with 18 percent GST, rounded
const withGst = courses.map((c) => Math.round(c.price * 1.18));
console.log(withGst);

// 4) A label for each course
const labels = courses.map((c) => `${c.title} (${c.lessons} lessons)`);
console.log(labels);

// 5) The classic mistake: braces without return
const broken = courses.map((c) => {
  c.title;
});
console.log(broken);

// map never changes the original
console.log(courses.length, courses[0].title);
