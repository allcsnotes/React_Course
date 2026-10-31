import { useState } from 'react'
import { useRenderCount } from './useRenderCount.ts'

export default function CartButton() {
  const n = useRenderCount()
  const [cart, setCart] = useState(0)
  return (
    <div className="bar">
      <span className="cart">Cart: {cart}</span>
      <button onClick={setCart(cart + 1)}>
        Add to cart
      </button>
      <span className="cnt">cart {n}</span>
    </div>
  )
}
