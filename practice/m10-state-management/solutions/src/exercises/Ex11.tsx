import { cartReducer, initialCart } from '../reducers/cartReducer.ts'
import { courses } from '../data.ts'

// Exercise 11 is a node exercise: the real answer is src/reducers/cartReducer.ts
// and the check is `node scripts/ex11.ts`. This page just shows the reducer working
// without any React hook at all, calling it by hand.
export default function Ex11() {
  let state = cartReducer(initialCart, { type: 'add', course: courses[0] })
  state = cartReducer(state, { type: 'add', course: courses[0] })
  state = cartReducer(state, { type: 'applyCoupon', code: 'SAVE10' })
  const cleared = cartReducer(state, { type: 'clear' })

  return (
    <div className="card">
      <p>No hook here, only function calls:</p>
      <p>
        quantity {state.items[0].quantity} · coupon {state.coupon}
      </p>
      <p>
        after clear: {cleared.items.length} items · coupon {String(cleared.coupon)}
      </p>
      <p className="muted">The real check: run node scripts/ex11.ts</p>
    </div>
  )
}
