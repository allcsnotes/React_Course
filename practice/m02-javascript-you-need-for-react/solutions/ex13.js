// Exercise 13 - Who goes first? Waiting code runs last
console.log('1: take the order');

setTimeout(() => {
  console.log('2: food is ready');
}, 500);

setTimeout(() => {
  console.log('2b: even zero waits its turn');
}, 0);

console.log('3: greet the next customer');

// Part 2: a callback that is called later
const orderFood = (dish, callback) => {
  console.log(`cooking ${dish}...`);
  setTimeout(() => {
    callback(`${dish} is ready`);
  }, 300);
};

orderFood('soup', (message) => {
  console.log(message);
  orderFood('pizza', (message2) => {
    console.log(message2);
  });
});
