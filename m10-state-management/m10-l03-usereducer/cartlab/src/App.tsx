import { useReducer } from 'react'
import { cartReducer, initialCart } from './cart.ts'
import { View } from './View.tsx'

export default function App() {
  const [cart, dispatch] = useReducer(cartReducer, initialCart)

  return (
    <View
      items={cart.items}
      coupon={cart.coupon}
      onAdd={course => dispatch({ type: 'add', course })}
      onRemove={id => dispatch({ type: 'remove', id })}
      onCoupon={code => dispatch({ type: 'applyCoupon', code })}
      onClear={() => dispatch({ type: 'clear' })}
    />
  )
}
