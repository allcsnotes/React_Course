// Run with: node scripts/ex19.ts
import assert from 'node:assert/strict'
import { getTotals } from '../src/lib/totals.ts'

const none = getTotals([499, 399], null)
console.log('no coupon:', none)
assert.deepEqual(none, { subtotal: 898, discount: 0, total: 898 })

const save10 = getTotals([499, 399], 'SAVE10')
console.log('SAVE10:', save10)
assert.deepEqual(save10, { subtotal: 898, discount: 90, total: 808 }) // 89.8 rounds to 90

const flat = getTotals([499, 399], 'FLAT200')
console.log('FLAT200:', flat)
assert.deepEqual(flat, { subtotal: 898, discount: 200, total: 698 })

const capped = getTotals([150], 'FLAT200')
console.log('FLAT200 on 150:', capped)
assert.deepEqual(capped, { subtotal: 150, discount: 150, total: 0 })

assert.deepEqual(getTotals([499, 399], 'NOPE'), { subtotal: 898, discount: 0, total: 898 })
assert.deepEqual(getTotals([], 'SAVE10'), { subtotal: 0, discount: 0, total: 0 })
console.log('getTotals: all checks passed')
