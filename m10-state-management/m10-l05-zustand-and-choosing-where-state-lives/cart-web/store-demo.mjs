import { createStore } from 'zustand/vanilla'

const cart = createStore((set) => ({
  items: [],
  add: (slug) =>
    set((state) => ({ items: [...state.items, slug] })),
}))

cart.subscribe((state, before) => {
  console.log('changed:', before.items.length,
    'to', state.items.length)
})

cart.getState().add('react-for-beginners')
cart.getState().add('sql-in-two-weeks')
console.log('items now:', cart.getState().items.length)
