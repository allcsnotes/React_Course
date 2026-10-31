import type { CartItem, Course } from './types.ts'

export function addItem(items: CartItem[], c: Course): CartItem[] {
  const has = items.some(i => i.id === c.id)
  if (!has) return [...items, { ...c, qty: 1 }]
  return items.map(i =>
    i.id === c.id ? { ...i, qty: i.qty + 1 } : i)
}
