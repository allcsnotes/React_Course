const course = {
  id: 1,
  title: 'React for Beginners',
  teacher: 'Meera',
  lessons: 12,
  price: 499,
  free: false,
};
const { title, teacher, price } = course;
console.log(`${title} by ${teacher}: Rs ${price}`);
