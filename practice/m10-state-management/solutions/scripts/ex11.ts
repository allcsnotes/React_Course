// Run with: node scripts/ex11.ts   (Node 24 runs TypeScript files directly)
import assert from 'node:assert/strict'
import { cartReducer, initialCart, cartCount, cartTotal } from '../src/reducers/cartReducer.ts'
import { courses } from '../src/data.ts'

const react = courses[0]
const sql = courses[1]

// 1. add the same course twice: quantity two
let state = cartReducer(initialCart, { type: 'add', course: react })
state = cartReducer(state, { type: 'add', course: react })
console.log('after two adds:', 'items', state.items.length, 'quantity', state.items[0].quantity)
assert.equal(state.items.length, 1)
assert.equal(state.items[0].quantity, 2)

// 2. coupon only works on a non-empty cart, and only the right code
assert.equal(cartReducer(initialCart, { type: 'applyCoupon', code: 'SAVE10' }), initialCart)
assert.equal(cartReducer(state, { type: 'applyCoupon', code: 'WRONG' }), state)
state = cartReducer(state, { type: 'applyCoupon', code: 'SAVE10' })
console.log('coupon:', state.coupon)
assert.equal(state.coupon, 'SAVE10')

// 3. totals: 2 x 499 = 998, minus 10 percent (100, rounded) = 898
console.log('count', cartCount(state), 'total', cartTotal(state))
assert.equal(cartTotal(state), 898)

// 4. removing the last course also removes the coupon
const removed = cartReducer(state, { type: 'remove', id: react.id })
console.log('after remove:', 'items', removed.items.length, 'coupon', removed.coupon)
assert.equal(removed.items.length, 0)
assert.equal(removed.coupon, null)

// 5. clear
assert.equal(cartReducer(state, { type: 'clear' }).items.length, 0)

// 6. PURE: the old state must be untouched (deep-frozen objects throw if anyone mutates them)
function deepFreeze<T>(value: T): T {
  if (typeof value === 'object' && value !== null) {
    Object.values(value).forEach(deepFreeze)
    Object.freeze(value)
  }
  return value
}
const frozen = deepFreeze(cartReducer(cartReducer(initialCart, { type: 'add', course: react }), { type: 'add', course: sql }))
const next = cartReducer(frozen, { type: 'add', course: react })
assert.equal(frozen.items[0].quantity, 1)
assert.equal(next.items[0].quantity, 2)
assert.equal(initialCart.items.length, 0)
console.log('frozen input untouched: quantity still', frozen.items[0].quantity, '| initialCart items', initialCart.items.length)

console.log('all checks passed')
