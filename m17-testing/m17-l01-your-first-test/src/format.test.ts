import { expect, test } from 'vitest'
import { formatPrice } from './format'

test('formats cents as dollars with two decimals', () => {
  expect(formatPrice(4990)).toBe('$49.90')
})

test('a whole-dollar price keeps its two decimals', () => {
  expect(formatPrice(3900)).toBe('$39.00')
})
