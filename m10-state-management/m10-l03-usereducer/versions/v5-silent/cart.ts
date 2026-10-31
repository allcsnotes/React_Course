import { addItem } from './addItem.ts'
import type { CartItem, Course } from './types.ts'

export type CartState = {
  items: CartItem[]
  coupon: string | null
}

export type CartAction =
  | { type: 'add'; course: Course }
  | { type: 'remove'; id: string }
  | { type: 'applyCoupon'; code: string }
  | { type: 'clear' }

export const initialCart: CartState = {
  items: [],
  coupon: null,
}

export function cartReducer(
  state: CartState,
  action: CartAction,
): CartState {
  const { items, coupon } = state
  switch (action.type) {
    case 'add':
      return { items: addItem(items, action.course), coupon }
    case 'remove': {
      const left = items.filter(i => i.id !== action.id)
      if (left.length === 0) return initialCart
      return { items: left, coupon }
    }
    case 'applyCoupon':
      if (items.length === 0) return state
      if (action.code !== 'SAVE10') return state
      return { items, coupon: action.code }
    default:
      return state
  }
}
