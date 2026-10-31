import type { CartAction } from './cart.ts'

export function describe(action: CartAction): string {
  if (action.type === 'remove') return action.id
  return action.id
}
