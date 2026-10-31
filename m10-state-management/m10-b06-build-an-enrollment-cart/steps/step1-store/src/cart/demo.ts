import { useCartStore } from './cartStore.ts'
import { getTotals } from './totals.ts'

const react = {
  slug: 'react',
  title: 'React for Beginners',
  price: 499,
}
const sql = {
  slug: 'sql',
  title: 'SQL in Two Weeks',
  price: 399,
}

const { add, applyCoupon } = useCartStore.getState()
add(react)
add(sql)
applyCoupon('SAVE10')

const { items, coupon } = useCartStore.getState()
console.log(items.length, 'items')
console.log(getTotals(items, coupon))

const cheap = { slug: 'a', title: 'A', price: 150 }
console.log(getTotals([cheap], 'FLAT200'))
