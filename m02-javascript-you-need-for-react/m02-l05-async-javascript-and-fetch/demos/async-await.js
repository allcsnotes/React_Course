function orderFood(dish, kitchenIsOpen) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (kitchenIsOpen) {
        resolve(dish)
      } else {
        reject(new Error('The kitchen is closed'))
      }
    }, 1000)
  })
}

async function dinner() {
  console.log('Ordering...')
  const food = await orderFood('pizza', true)
  console.log('Eating', food)
}

dinner()
console.log('Meanwhile, I read the menu')
