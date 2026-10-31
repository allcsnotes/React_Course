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

orderFood('pizza', false)
  .then((food) => {
    console.log('Eating', food)
  })
  .catch((error) => {
    console.log('Problem:', error.message)
  })
