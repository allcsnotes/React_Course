const describe = (title, lessons, price) => {
  return `${title}: ${lessons} lessons, Rs ${price}`;
};

console.log(describe('React for Beginners', 12, 499));
