import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Course } from '../data.ts'

type State17 = {
  items: Course[]
  coupon: string | null
  note: string
  add: (course: Course) => void
  applyCoupon: (code: string) => void
  setNote: (note: string) => void
}

// persist saves the data (not the functions) in localStorage under the key "m10-ex17".
export const useStore17 = create<State17>()(
  persist(
    (set) => ({
      items: [],
      coupon: null,
      note: '',
      add: (course) => set((s) => ({ items: [...s.items, course] })),
      applyCoupon: (code) => set({ coupon: code }),
      setNote: (note) => set({ note }),
    }),
    { name: 'm10-ex17' },
  ),
)
