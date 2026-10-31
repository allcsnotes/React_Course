// Exercise 19 - Combine everything: the catalog report
import courses from './courses.js';
import { formatPrice, withGst } from './helpers/price.js';

const enrollments = [
  { student: 'Lukas', courseId: 1 },
  { student: 'Priya', courseId: 4 },
  { student: 'Lukas', courseId: 3 },
  { student: 'Asha', courseId: 99 },
  { student: 'Priya', courseId: 2 },
];

// 1) a sale copy of the list: every paid course, 20 percent off. Originals untouched.
const onSale = courses.map((c) => (c.price > 0 ? { ...c, price: Math.round(c.price * 0.8) } : c));

// 2) the catalog, most expensive first
console.log('CATALOG');
const byPriceDesc = onSale.toSorted((a, b) => b.price - a.price);
for (const { title, teacher, lessons, price } of byPriceDesc) {
  const tag = price === 0 ? 'Free' : `${formatPrice(price)} (with GST ${formatPrice(withGst(price))})`;
  console.log(`  ${title} by ${teacher}, ${lessons} lessons, ${tag}`);
}
console.log('Original price of the first course:', formatPrice(courses[0].price));

// 3) who joined what
console.log('ENROLLMENTS');
for (const { student, courseId } of enrollments) {
  const course = courses.find((c) => c.id === courseId);
  console.log(`  ${student}: ${course?.title ?? 'course not found'}`);
}

// 4) the bill for each student
console.log('BILLS');
const students = ['Lukas', 'Priya', 'Asha'];
for (const student of students) {
  const bill = enrollments
    .filter((e) => e.student === student)
    .map((e) => courses.find((c) => c.id === e.courseId))
    .reduce((sum, course) => sum + (course?.price ?? 0), 0);
  console.log(`  ${student}: ${bill === 0 ? 'nothing to pay' : formatPrice(bill)}`);
}

// 5) summary
const summary = {
  courses: courses.length,
  free: courses.filter((c) => c.free).length,
  lessons: courses.reduce((sum, c) => sum + c.lessons, 0),
  anyFree: courses.some((c) => c.free),
  allFree: courses.every((c) => c.free),
};
console.log(summary);
const { free, lessons } = summary;
console.log(`${free} free courses, ${lessons} lessons in total`);
