import { create } from 'zustand'
import type { Course } from '../data.ts'

export type CartState16 = {
  items: Course[]
  coupon: string | null
  add: (course: Course) => void
  applyCoupon: (code: string) => void
}

// The double round brackets are the TypeScript detail from lesson 5.
export const useCartStore = create<CartState16>()((set) => ({
  items: [],
  coupon: null,
  // set merges: fields we do not mention keep their old value.
  add: (course) => set((state) => ({ items: [...state.items, course] })),
  applyCoupon: (code) => set({ coupon: code }),
}))
