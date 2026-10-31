function describe(title, lessons, price) {
  return `${title}: ${lessons} lessons, Rs ${price}`;
}

console.log(describe('React for Beginners', 12, 499));
console.log(describe('Python from Zero', 20, 0));
console.log(describe('System Design', 25, 999));
