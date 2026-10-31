import { expect, test } from 'vitest'
import { getTotals } from './totals'

const react = { slug: 'react', title: 'React for Beginners', teacher: 'Meera', price: 499 }
const sql = { slug: 'sql', title: 'SQL in Two Weeks', teacher: 'Asha', price: 399 }

test('SAVE10 takes ten percent off', () => {
  expect(getTotals([react, sql], 'SAVE10')).toEqual({ subtotal: 898, discount: 90, total: 808 })
})
