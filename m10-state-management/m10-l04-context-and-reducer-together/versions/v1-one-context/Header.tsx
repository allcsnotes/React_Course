import { useCart } from './CartContext.tsx'
import { RenderCount } from './RenderCount.tsx'

export function Header() {
  const { state } = useCart()
  const count = state.items.reduce((sum, i) => sum + i.qty, 0)
  return (
    <header>
      <h1>allcsvideos</h1>
      <span className="badge">Cart {count}</span>
      <RenderCount />
    </header>
  )
}
