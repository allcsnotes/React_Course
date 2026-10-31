import { StrictMode, useReducer } from 'react'
import { courses } from '../data.ts'
import { initialCart, cartCount, cartTotal, type CartState, type CartAction } from '../reducers/cartReducer.ts'

// BROKEN on purpose: push changes the list that React still holds as the old state.
function badReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add':
      state.items.push({ course: action.course, quantity: 1 })
      return { ...state } // looks like a copy, but the list inside is the same one
    default:
      return state
  }
}

function Cart() {
  const [cart, dispatch] = useReducer(badReducer, initialCart)
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

export default function B13Mutation() {
  return (
    <StrictMode>
      <Cart />
    </StrictMode>
  )
}
