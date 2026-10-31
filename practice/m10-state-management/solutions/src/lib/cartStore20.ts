import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { z } from 'zod'
import { COUPONS } from './totals.ts'

export type CartItem = { slug: string; title: string; price: number }

type CartState20 = {
  items: CartItem[]
  coupon: string | null
  add: (item: CartItem) => void
  remove: (slug: string) => void
  applyCoupon: (code: string) => void
  removeCoupon: () => void
}

// What a good shelf looks like. Types vanish at run time, so we check the saved data with zod.
const Saved = z.object({
  items: z.array(z.object({ slug: z.string(), title: z.string(), price: z.number() })),
  coupon: z.string().nullable(),
})

export const useCart20 = create<CartState20>()(
  persist(
    (set) => ({
      items: [],
      coupon: null,
      add: (item) =>
        set((s) => {
          if (s.items.some((i) => i.slug === item.slug)) return s // a course is bought once
          return { items: [...s.items, item] }
        }),
      remove: (slug) =>
        set((s) => {
          const items = s.items.filter((i) => i.slug !== slug)
          return { items, coupon: items.length === 0 ? null : s.coupon } // empty cart, no coupon
        }),
      applyCoupon: (code) => set((s) => (code in COUPONS && s.items.length > 0 ? { coupon: code } : s)),
      removeCoupon: () => set({ coupon: null }),
    }),
    {
      name: 'm10-ex20-cart',
      // The saved value is input from outside: only merge it when it fits the shape.
      merge: (saved, current) => {
        const result = Saved.safeParse(saved)
        return result.success ? { ...current, ...result.data } : current
      },
    },
  ),
)
