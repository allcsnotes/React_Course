import { useCart } from './CartContext.tsx'
import { RenderCount } from './RenderCount.tsx'

export function ClearButton() {
  const { dispatch } = useCart()
  return (
    <div className="line">
      <button onClick={() => dispatch({ type: 'clear' })}>Clear cart</button>
      <RenderCount />
    </div>
  )
}
