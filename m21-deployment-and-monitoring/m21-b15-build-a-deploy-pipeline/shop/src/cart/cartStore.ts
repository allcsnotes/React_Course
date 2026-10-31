import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { z } from 'zod'
import type { CartItem } from './types'

const saved = z.object({
  items: z.array(
    z.object({
      slug: z.string(),
      title: z.string(),
      price: z.number(),
    }),
  ),
  coupon: z.string().nullable(),
})

type CartStore = {
  items: CartItem[]
  coupon: string | null
  add: (item: CartItem) => void
  remove: (slug: string) => void
  applyCoupon: (code: string) => void
  removeCoupon: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      coupon: null,
      add: (item) =>
        set((state) => {
          const has = state.items.some(
            (i) => i.slug === item.slug,
          )
          return has
            ? state
            : { items: [...state.items, item] }
        }),
      remove: (slug) =>
        set((state) => ({
          items: state.items.filter(
            (item) => item.slug !== slug,
          ),
        })),
      applyCoupon: (code) => set({ coupon: code }),
      removeCoupon: () => set({ coupon: null }),
    }),
    {
      name: 'cart',
      merge: (persisted, current) => {
        const result = saved.safeParse(persisted)
        if (!result.success) return current
        return { ...current, ...result.data }
      },
    },
  ),
)
