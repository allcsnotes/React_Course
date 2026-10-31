const course = {
  id: 1,
  title: 'React for Beginners',
  teacher: 'Meera',
  lessons: 12,
  price: 499,
  free: false,
};
const sale = { price: 0, ...course };
console.log(sale.price);
