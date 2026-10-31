import { expect, test } from 'vitest'
import { total } from './totals.ts'

const react = { slug: 'react', title: 'React for Beginners', price: 499 }
const sql = { slug: 'sql', title: 'SQL in Two Weeks', price: 399 }

test('an empty cart costs nothing', () => {
  expect(total([])).toBe(0)
})

test('two courses add up', () => {
  expect(total([react, sql])).toBe(898)
})
