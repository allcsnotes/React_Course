function formatPrice(price) {
  return price === 0 ? 'Free' : `Rs ${price}`
}

export default formatPrice
