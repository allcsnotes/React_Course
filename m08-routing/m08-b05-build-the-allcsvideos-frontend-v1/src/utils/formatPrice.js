export default function formatPrice(price) {
  return price === 0 ? 'Free' : `Rs ${price}`
}
