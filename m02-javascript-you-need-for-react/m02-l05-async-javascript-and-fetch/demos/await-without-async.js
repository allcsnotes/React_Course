function dinner() {
  const food = await orderFood('pizza', true)
  console.log('Eating', food)
}
