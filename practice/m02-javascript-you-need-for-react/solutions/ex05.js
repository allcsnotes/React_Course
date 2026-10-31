// Exercise 05 - Unpacking with destructuring
const courses = [
  { id: 1, title: 'React for Beginners', teacher: 'Meera', lessons: 12, price: 499, free: false },
  { id: 2, title: 'Python from Zero', teacher: 'Meera', lessons: 20, price: 0, free: true },
  { id: 3, title: 'System Design', teacher: 'Rahul', lessons: 25, price: 999, free: false },
  { id: 4, title: 'DevOps Basics', teacher: 'Asha', lessons: 15, price: 0, free: true },
];
const course = courses[0];

// 1) objects: curly braces, the names must match the keys
const { title, teacher, price } = course;
console.log(`${title} by ${teacher}, Rs ${price}`);

// 2) arrays: square brackets, the position decides
const [first, second] = courses;
console.log(first.title);
console.log(second.title);

// 3) function parameters
const line = ({ title, price }) => `${title}: Rs ${price}`;
console.log(line(courses[0]));
console.log(line(courses[1]));

// 4) a pair like the one useState gives you: [value, function]
const pair = [0, (n) => n + 1];
const [likes, addLike] = pair;
console.log(likes);
console.log(addLike(likes));
