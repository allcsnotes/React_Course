import type { CartItem } from '../types'

export type Coupon = {
  label: string
  percent?: number
  flat?: number
}

export const COUPONS: Record<string, Coupon> = {
  SAVE10: { label: '10% off', percent: 10 },
  FLAT200: { label: 'Rs 200 off', flat: 200 },
}

export function getTotals(
  items: CartItem[],
  code: string | null,
) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price,
    0,
  )
  const coupon = code ? COUPONS[code] : undefined
  const percent = coupon?.percent ?? 0
  const flat = coupon?.flat ?? 0
  const percentOff = (subtotal * percent) / 100
  const off = Math.round(percentOff) + flat
  const discount = Math.min(off, subtotal)
  return {
    subtotal,
    discount,
    total: subtotal - discount,
  }
}
