const price = 499;

let label;
if (price === 0) {
  label = 'Free';
} else {
  label = `Rs ${price}`;
}

console.log(label);
