import { useState } from 'react'
import { addItem } from './addItem.ts'
import type { CartItem, Course } from './types.ts'
import { View } from './View.tsx'

export default function App() {
  const [items, setItems] = useState<CartItem[]>([])
  const [coupon, setCoupon] = useState<string | null>(null)

  function add(course: Course) {
    setItems(addItem(items, course))
  }
  function remove(id: string) {
    setItems(items.filter(i => i.id !== id))
  }
  function applyCoupon(code: string) {
    if (items.length > 0 && code === 'SAVE10') setCoupon(code)
  }
  function clear() {
    setItems([])
    setCoupon(null)
  }

  return (
    <View
      items={items}
      coupon={coupon}
      onAdd={add}
      onRemove={remove}
      onCoupon={applyCoupon}
      onClear={clear}
    />
  )
}
