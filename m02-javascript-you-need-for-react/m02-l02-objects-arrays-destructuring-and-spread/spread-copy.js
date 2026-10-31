const course = {
  id: 1,
  title: 'React for Beginners',
  teacher: 'Meera',
  lessons: 12,
  price: 499,
  free: false,
};
const copy = { ...course };
console.log(copy.title, copy.price);
