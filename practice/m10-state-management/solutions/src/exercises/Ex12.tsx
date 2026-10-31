import { useReducer } from 'react'
import { courses } from '../data.ts'
import { cartReducer, initialCart, cartCount, cartTotal } from '../reducers/cartReducer.ts'

// The old version had useState for items and coupon, and four handlers.
// The "empty cart loses its coupon" rule was in the Clear handler only.
// Now every change is a dispatch, and the rule lives in cartReducer.
export default function Ex12() {
  const [cart, dispatch] = useReducer(cartReducer, initialCart)

  return (
    <div className="cols">
      <div className="card">
        <h3>Courses</h3>
        {courses.slice(0, 3).map((c) => (
          <div key={c.id}>
            <button onClick={() => dispatch({ type: 'add', course: c })}>Add</button> {c.title}
          </div>
        ))}
      </div>
      <div className="card">
        <h3>Cart ({cartCount(cart)})</h3>
        {cart.items.map((i) => (
          <div key={i.course.id}>
            {i.course.title} x{i.quantity}{' '}
            <button onClick={() => dispatch({ type: 'remove', id: i.course.id })}>Remove</button>
          </div>
        ))}
        {cart.coupon === null ? (
          <button onClick={() => dispatch({ type: 'applyCoupon', code: 'SAVE10' })}>Apply SAVE10</button>
        ) : (
          <span className="chip">{cart.coupon} applied</span>
        )}
        <p>Total: Rs {cartTotal(cart)}</p>
        <button onClick={() => dispatch({ type: 'clear' })}>Clear</button>
      </div>
    </div>
  )
}
