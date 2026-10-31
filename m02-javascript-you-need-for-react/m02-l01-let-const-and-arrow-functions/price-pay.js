function finalPrice(price, discount) {
  return price - discount;
}

const pay = finalPrice(499, 100);
console.log(`You pay Rs ${pay}`);
