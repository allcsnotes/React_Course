import { expect, it } from 'vitest'
import { useCartStore } from './cartStore'

const react = { slug: 'r', title: 'React', price: 499 }

it('keeps one copy of a course', () => {
  const { add } = useCartStore.getState()
  add(react)
  add(react)
  expect(useCartStore.getState().items).toHaveLength(1)
})
