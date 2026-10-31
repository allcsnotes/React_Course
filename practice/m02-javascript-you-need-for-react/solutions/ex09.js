// Exercise 09 - One value from many, with reduce
const courses = [
  { id: 1, title: 'React for Beginners', teacher: 'Meera', lessons: 12, price: 499, free: false },
  { id: 2, title: 'Python from Zero', teacher: 'Meera', lessons: 20, price: 0, free: true },
  { id: 3, title: 'System Design', teacher: 'Rahul', lessons: 25, price: 999, free: false },
  { id: 4, title: 'DevOps Basics', teacher: 'Asha', lessons: 15, price: 0, free: true },
];
const totalLessons = courses.reduce((sum, c) => sum + c.lessons, 0);
console.log('Total lessons:', totalLessons);

const bill = courses.reduce((sum, c) => sum + c.price, 0);
console.log(`Bill for all four: Rs ${bill}`);

// Chain: filter first, then reduce
const freeLessons = courses
  .filter((c) => c.free)
  .reduce((sum, c) => sum + c.lessons, 0);
console.log('Lessons in free courses:', freeLessons);

// Watch the running total, round by round
courses.reduce((sum, c) => {
  console.log(`sum is ${sum}, adding ${c.lessons}`);
  return sum + c.lessons;
}, 0);

// The mistake: no starting value
const oops = courses.reduce((sum, c) => sum + c.price);
console.log(oops);
