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
  add: (slug) => set((state) => ({ items: [...state.items, slug] })),
  applyCoupon: (code) => set({ coupon: code }),
}))
