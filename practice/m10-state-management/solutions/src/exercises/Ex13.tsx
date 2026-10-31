import { StrictMode, useReducer } from 'react'
import { courses } from '../data.ts'
import { cartCount, cartTotal, cartReducer, initialCart } from '../reducers/cartReducer.ts'

// StrictMode runs every reducer twice in development, on purpose.
// A reducer that mutates its input gives a wrong answer here. A pure one does not.
// The version with push is in src/broken/B13Mutation.tsx.
function Cart() {
  const [cart, dispatch] = useReducer(cartReducer, initialCart)
  return (
    <div className="card">
      <button onClick={() => dispatch({ type: 'add', course: courses[0] })}>Add React for Beginners</button>
      <p>Rows: {cart.items.length}</p>
      {cart.items.map((i, index) => (
        <div key={index}>
          {i.course.title} x{i.quantity}
        </div>
      ))}
      <p>
        Count {cartCount(cart)} · Total Rs {cartTotal(cart)}
      </p>
    </div>
  )
}

export default function Ex13() {
  return (
    <StrictMode>
      <Cart />
    </StrictMode>
  )
}
