function orderFood(dish, callback) {
  setTimeout(() => callback(dish + ' is ready'), 1000)
}

orderFood('soup', (a) => {
  console.log(a)
  orderFood('pizza', (b) => {
    console.log(b)
    orderFood('cake', (c) => {
      console.log(c)
    })
  })
})
