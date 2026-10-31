const course = {
  id: 1,
  title: 'React for Beginners',
  teacher: 'Meera',
  lessons: 12,
  price: 499,
  free: false,
};
const banner = course;
banner.price = 0;
console.log(course.price);
