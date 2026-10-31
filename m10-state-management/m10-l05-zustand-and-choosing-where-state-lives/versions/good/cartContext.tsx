import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react'

type State = { items: string[]; coupon: string | null }
type Action = { type: 'add'; slug: string } | { type: 'coupon'; code: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add':
      return { ...state, items: [...state.items, action.slug] }
    case 'coupon':
      return { ...state, coupon: action.code }
  }
}

const CartStateContext = createContext<State | null>(null)
const CartDispatchContext = createContext<Dispatch<Action> | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], coupon: null })
  return (
    <CartStateContext value={state}>
      <CartDispatchContext value={dispatch}>{children}</CartDispatchContext>
    </CartStateContext>
  )
}

export function useCart() {
  const value = useContext(CartStateContext)
  if (!value) throw new Error('useCart must be used inside a CartProvider')
  return value
}

export function useCartDispatch() {
  const value = useContext(CartDispatchContext)
  if (!value) throw new Error('useCartDispatch must be used inside a CartProvider')
  return value
}
