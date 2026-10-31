function orderFood(dish, callback) {
  console.log('Cooking', dish)
  setTimeout(() => callback(dish + ' is ready'), 1000)
}

orderFood('pizza', (message) => {
  console.log(message)
})
