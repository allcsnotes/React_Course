function priceLabel(price) {
  if (price === 0) {
    return 'Free';
  } else if (price < 500) {
    return 'Budget';
  } else {
    return 'Premium';
  }
}

console.log(priceLabel(499));
console.log(priceLabel(0));
console.log(priceLabel(999));
console.log(priceLabel(500));
