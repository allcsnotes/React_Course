import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react'
import { courses, type Course } from '../data.ts'
import { Renders } from '../Renders.tsx'
import {
  cartReducer,
  initialCart,
  cartCount,
  cartTotal,
  type CartAction,
  type CartState,
} from '../reducers/cartReducer.ts'

// Two boxes: one for the state (changes often), one for dispatch (never changes).
const CartStateContext = createContext<CartState | null>(null)
const CartDispatchContext = createContext<Dispatch<CartAction> | null>(null)

function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCart)
  return (
    <CartStateContext value={state}>
      <CartDispatchContext value={dispatch}>{children}</CartDispatchContext>
    </CartStateContext>
  )
}

function useCart(): CartState {
  const value = useContext(CartStateContext)
  if (value === null) throw new Error('useCart must be used inside CartProvider')
  return value
}

function useCartDispatch(): Dispatch<CartAction> {
  const value = useContext(CartDispatchContext)
  if (value === null) throw new Error('useCartDispatch must be used inside CartProvider')
  return value
}

// Readers
function Header() {
  const cart = useCart()
  return (
    <div className="row">
      Header: cart {cartCount(cart)}
      <Renders />
    </div>
  )
}

function Total() {
  const cart = useCart()
  return (
    <div className="row">
      Total: Rs {cartTotal(cart)}
      <Renders />
    </div>
  )
}

// Reader and writer
function CartList() {
  const cart = useCart()
  const dispatch = useCartDispatch()
  return (
    <div>
      <div className="row">
        List: {cart.items.length} rows
        <Renders />
      </div>
      {cart.items.map((i) => (
        <div key={i.course.id}>
          {i.course.title} x{i.quantity}{' '}
          <button onClick={() => dispatch({ type: 'remove', id: i.course.id })}>Remove</button>
        </div>
      ))}
    </div>
  )
}

// Writers: they only dispatch, so they are never drawn again.
function AddButton({ course }: { course: Course }) {
  const dispatch = useCartDispatch()
  return (
    <span className="row">
      <button onClick={() => dispatch({ type: 'add', course })}>Add {course.title}</button>
      <Renders />
    </span>
  )
}

function CouponButton() {
  const dispatch = useCartDispatch()
  return (
    <span className="row">
      <button onClick={() => dispatch({ type: 'applyCoupon', code: 'SAVE10' })}>Apply SAVE10</button>
      <Renders />
    </span>
  )
}

function ClearButton() {
  const dispatch = useCartDispatch()
  return (
    <span className="row">
      <button onClick={() => dispatch({ type: 'clear' })}>Clear</button>
      <Renders />
    </span>
  )
}

function Catalog() {
  return (
    <div>
      {courses.slice(0, 2).map((c) => (
        <AddButton key={c.id} course={c} />
      ))}
    </div>
  )
}

function CartPanel() {
  return (
    <div>
      <CartList />
      <Total />
      <CouponButton />
      <ClearButton />
    </div>
  )
}

export default function Ex15() {
  return (
    <CartProvider>
      <div className="card">
        <Header />
        <Catalog />
        <CartPanel />
      </div>
    </CartProvider>
  )
}
