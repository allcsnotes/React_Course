import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Course } from './api'

type CartValue = { items: Course[]; add: (c: Course) => void; remove: (slug: string) => void; clear: () => void }
const CartContext = createContext<CartValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Course[]>([])
  const value: CartValue = {
    items,
    add: c => setItems(list => (list.some(x => x.slug === c.slug) ? list : [...list, c])),
    remove: slug => setItems(list => list.filter(x => x.slug !== slug)),
    clear: () => setItems([]),
  }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const v = useContext(CartContext)
  if (!v) throw new Error('useCart needs a CartProvider')
  return v
}
