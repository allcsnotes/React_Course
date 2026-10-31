import { create } from 'zustand'
import type { CartItem } from './types'

type CartStore = {
  items: CartItem[]
  coupon: string | null
  add: (item: CartItem) => void
  remove: (slug: string) => void
  applyCoupon: (code: string) => void
  removeCoupon: () => void
}

export const useCartStore = create<CartStore>()(
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
)
