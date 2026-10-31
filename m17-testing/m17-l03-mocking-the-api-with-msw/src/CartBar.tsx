import { useCart } from './CartContext.tsx'

export function CartBar() {
  const { count, add } = useCart()
  return (
    <div className="bar">
      <button onClick={add}>Enrol in React for Beginners</button>
      <span className="badge">Cart: {count}</span>
    </div>
  )
}
