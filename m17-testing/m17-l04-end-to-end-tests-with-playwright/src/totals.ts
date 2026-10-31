import type { Course } from './api'

const COUPONS: Record<string, { percent?: number; flat?: number }> = {
  SAVE10: { percent: 10 },
  FLAT200: { flat: 200 },
}

export const knownCoupon = (code: string) => code in COUPONS

export function getTotals(items: Course[], code: string) {
  const subtotal = items.reduce((sum, c) => sum + c.price, 0)
  const c = COUPONS[code]
  const raw = c ? (c.percent ? Math.round((subtotal * c.percent) / 100) : (c.flat ?? 0)) : 0
  const discount = Math.min(subtotal, raw)
  return { subtotal, discount, total: subtotal - discount }
}
