import type { Course } from '../data.ts'

export type CartItem = { course: Course; quantity: number }
export type CartState = { items: CartItem[]; coupon: string | null }

export type CartAction =
  | { type: 'add'; course: Course }
  | { type: 'remove'; id: number }
  | { type: 'applyCoupon'; code: string }
  | { type: 'clear' }

export const initialCart: CartState = { items: [], coupon: null }

function assertNever(value: never): never {
  throw new Error('Unhandled action: ' + JSON.stringify(value))
}

// Returns a NEW list: one more of this course.
function addItem(items: CartItem[], course: Course): CartItem[] {
  const found = items.some((i) => i.course.id === course.id)
  if (!found) return [...items, { course, quantity: 1 }]
  return items.map((i) => (i.course.id === course.id ? { ...i, quantity: i.quantity + 1 } : i))
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add':
      return { ...state, items: addItem(state.items, action.course) }
    case 'remove': {
      const items = state.items.filter((i) => i.course.id !== action.id)
      // The rule we used to forget: an empty cart has no coupon.
      if (items.length === 0) return initialCart
      return { ...state, items }
    }
    case 'applyCoupon':
      if (state.items.length === 0 || action.code !== 'SAVE10') return state
      return { ...state, coupon: action.code }
    case 'clear':
      return initialCart
    default:
      return assertNever(action)
  }
}

export function cartCount(state: CartState): number {
  return state.items.reduce((sum, i) => sum + i.quantity, 0)
}

export function cartTotal(state: CartState): number {
  const subtotal = state.items.reduce((sum, i) => sum + i.course.price * i.quantity, 0)
  return state.coupon === 'SAVE10' ? subtotal - Math.round(subtotal * 0.1) : subtotal
}
