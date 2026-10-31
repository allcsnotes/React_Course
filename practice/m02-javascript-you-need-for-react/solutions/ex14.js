// Exercise 14 - The kitchen buzzer: promises and async/await
const kitchen = (dish, isOpen) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (isOpen) {
        resolve(dish);
      } else {
        reject(new Error('the kitchen is closed'));
      }
    }, 300);
  });

// 1) A buzzer is pending at first
const buzzer = kitchen('pizza', true);
console.log(buzzer);

// 2) then and catch
buzzer.then((food) => console.log('then: eating', food));
kitchen('cake', false)
  .then((food) => console.log('this never runs', food))
  .catch((error) => console.log('catch: Problem,', error.message));

// 3) async and await
const dinner = async (isOpen) => {
  try {
    console.log('ordering...');
    const food = await kitchen('soup', isOpen);
    console.log('eating', food);
  } catch (error) {
    console.log('Problem:', error.message);
  }
};

const main = async () => {
  console.log('--- async/await ---');
  const first = dinner(true);
  console.log('meanwhile, I read the menu');
  await first;
  await dinner(false);
};

// Wait one second, so the first part has finished, then start the second part.
setTimeout(main, 1000);
