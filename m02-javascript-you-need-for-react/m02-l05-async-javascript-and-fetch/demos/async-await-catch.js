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
  try {
    const food = await orderFood('pizza', false)
    console.log('Eating', food)
  } catch (error) {
    console.log('Problem:', error.message)
  }
}

dinner()
