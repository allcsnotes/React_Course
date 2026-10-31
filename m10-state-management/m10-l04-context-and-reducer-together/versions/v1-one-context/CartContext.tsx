import { createContext, useContext, useReducer } from 'react'
import type { Dispatch, ReactNode } from 'react'
import { cartReducer, initialCart } from './cart.ts'
import type { CartAction, CartState } from './cart.ts'

type CartValue = {
  state: CartState
  dispatch: Dispatch<CartAction>
}
type ProviderProps = { children: ReactNode }

const CartContext = createContext<CartValue | null>(null)

export function CartProvider({ children }: ProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialCart)
  return (
    <CartContext value={{ state, dispatch }}>
      {children}
    </CartContext>
  )
}

export function useCart() {
  const value = useContext(CartContext)
  if (value === null) {
    throw new Error('useCart must be used inside <CartProvider>')
  }
  return value
}
