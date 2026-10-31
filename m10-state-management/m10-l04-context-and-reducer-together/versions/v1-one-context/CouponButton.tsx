import { useCart } from './CartContext.tsx'
import { RenderCount } from './RenderCount.tsx'

export function CouponButton() {
  const { dispatch } = useCart()
  const apply = () => dispatch({ type: 'applyCoupon', code: 'SAVE10' })
  return (
    <div className="line">
      <button onClick={apply}>Apply SAVE10</button>
      <RenderCount />
    </div>
  )
}
