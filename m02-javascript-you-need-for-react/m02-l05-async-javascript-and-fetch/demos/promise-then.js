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

const buzzer = orderFood('pizza', true)
console.log(buzzer)

buzzer.then((food) => {
  console.log('Eating', food)
})

setTimeout(() => console.log(buzzer), 1500)
