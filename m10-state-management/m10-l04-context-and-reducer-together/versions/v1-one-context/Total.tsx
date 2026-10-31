import { useCart } from './CartContext.tsx'
import { RenderCount } from './RenderCount.tsx'

export function Total() {
  const { state } = useCart()
  const { items, coupon } = state
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const total = coupon ? Math.round(subtotal * 0.9) : subtotal
  return (
    <p className="total">
      Total: Rs {total} <RenderCount />
    </p>
  )
}
