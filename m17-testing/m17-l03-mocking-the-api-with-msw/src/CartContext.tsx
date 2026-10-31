import { createContext, useContext, useState, type ReactNode } from 'react'

type Cart = { count: number; add: () => void }

const CartContext = createContext<Cart | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0)
  return (
    <CartContext value={{ count, add: () => setCount((n) => n + 1) }}>
      {children}
    </CartContext>
  )
}

export function useCart() {
  const cart = useContext(CartContext)
  if (!cart) throw new Error('useCart must be used inside CartProvider')
  return cart
}
