export type Coupon = { kind: 'percent'; value: number } | { kind: 'flat'; value: number }

export const COUPONS: Record<string, Coupon> = {
  SAVE10: { kind: 'percent', value: 10 },
  FLAT200: { kind: 'flat', value: 200 },
}

export type Totals = { subtotal: number; discount: number; total: number }

export function getTotals(prices: number[], code: string | null): Totals {
  const subtotal = prices.reduce((sum, p) => sum + p, 0)
  const coupon = code === null ? undefined : COUPONS[code]
  let discount = 0
  if (coupon !== undefined) {
    discount = coupon.kind === 'percent' ? Math.round((subtotal * coupon.value) / 100) : coupon.value
  }
  // The discount can never be more than the subtotal.
  discount = Math.min(discount, subtotal)
  return { subtotal, discount, total: subtotal - discount }
}
