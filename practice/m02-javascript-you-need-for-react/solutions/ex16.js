// Exercise 16 - Comparisons and if / else if / else
// Part 1: predict. Each line prints true or false.
const price = 499;
console.log(price === 499);
console.log(price !== 0);
console.log(price > 500);
console.log(price < 500);
console.log(price >= 499);
console.log(price <= 100);
console.log(1 === '1');
console.log(1 == '1');
console.log(0 == '');

// Part 2: the label function
const priceLabel = (price) => {
  if (price === 0) {
    return 'Free';
  } else if (price < 500) {
    return 'Budget';
  } else {
    return 'Premium';
  }
};

console.log(priceLabel(499));
console.log(priceLabel(0));
console.log(priceLabel(999));
console.log(priceLabel(500));
