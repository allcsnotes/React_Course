// Exercise 02 - The course card, built from functions
const title = 'React for Beginners';
const teacher = 'Meera';
const lessons = 12;
const price = 499;

const finalPrice = (price, discount) => price - discount;
const twoSeats = (price) => price * 2;
const describe = (title, lessons, price) =>
  `${title} has ${lessons} lessons and costs Rs ${price}`;
const greet = () => 'Hello, Lukas!';

function seatsLeft(total, taken) {
  return total - taken;
}

console.log(describe(title, lessons, price));
console.log(describe('Python from Zero', 20, 0));
console.log(`Teacher: ${teacher}`);
console.log(finalPrice(price, 100));
console.log(twoSeats(price));
console.log(greet());

let seats = seatsLeft(20, 0);
seats = seats - 1;
console.log(`Seats left after Priya enrols: ${seats}`);
