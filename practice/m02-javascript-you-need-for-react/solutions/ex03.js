// Exercise 03 - Fixed versions of the four broken files

// a) const cannot be reassigned. The teacher does change, so use let.
let teacher = 'Meera';
teacher = 'Rahul';
console.log(teacher);

// b) braces mean you must write return
const total = (a, b) => {
  return a + b;
};
console.log(total(2, 3));

// c) only backticks understand ${...}
const price = 499;
console.log(`Price: Rs ${price}`);

// d) create the variable on an earlier line, before you use it
let seats = 20;
console.log(seats);
