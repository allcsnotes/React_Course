export default function formatPrice(price: number): string {
  return price === 0 ? 'Free' : `Rs ${price}`
}
