import { create } from 'zustand'

type CartState = {
  items: string[]
  coupon: string | null
  add: (slug: string) => void
  applyCoupon: (code: string) => void
}

export const useCartStore = create<CartState>()((set) => ({
  items: [],
  coupon: null,
  add: (slug) => set((state) => {
    state.items.push(slug)
    return state
  }),
  applyCoupon: (code) => set({ coupon: code }),
}))
