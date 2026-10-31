import { describe, expect, it } from 'vitest'
import { getTotals } from './totals'

const react = { slug: 'r', title: 'React', price: 499 }
const sql = { slug: 's', title: 'SQL', price: 399 }

describe('getTotals', () => {
  it('adds up the prices', () => {
    expect(getTotals([react, sql], null)).toEqual({
      subtotal: 898,
      discount: 0,
      total: 898,
    })
  })

  it('takes ten percent off with SAVE10', () => {
    expect(getTotals([react, sql], 'SAVE10')).toEqual({
      subtotal: 898,
      discount: 90,
      total: 808,
    })
  })

  it('never goes below zero', () => {
    const cheap = { ...sql, price: 150 }
    expect(getTotals([cheap], 'FLAT200')).toEqual({
      subtotal: 150,
      discount: 150,
      total: 0,
    })
  })
})
