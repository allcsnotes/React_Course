import { createContext, useContext, useReducer } from 'react'
import type { Dispatch, ReactNode } from 'react'
import { cartReducer, initialCart } from './cart.ts'
import type { CartAction, CartState } from './cart.ts'

type CartDispatch = Dispatch<CartAction>
type ProviderProps = { children: ReactNode }

const StateContext = createContext<CartState | null>(null)
const DispatchContext = createContext<CartDispatch | null>(null)

export function CartProvider({ children }: ProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialCart)
  return (
    <StateContext value={state}>
      <DispatchContext value={dispatch}>
        {children}
      </DispatchContext>
    </StateContext>
  )
}

export function useCart() {
  const state = useContext(StateContext)
  if (state === null) {
    throw new Error('useCart must be used inside <CartProvider>')
  }
  return state
}

export function useCartDispatch() {
  const dispatch = useContext(DispatchContext)
  if (dispatch === null) {
    throw new Error(
      'useCartDispatch must be used inside <CartProvider>',
    )
  }
  return dispatch
}
