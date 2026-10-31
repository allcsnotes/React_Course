const symbol = 'Rs'

export function formatPrice(price) {
  return `${symbol} ${price}`
}

export function totalPrice(list) {
  return list.reduce((sum, course) => sum + course.price, 0)
}
