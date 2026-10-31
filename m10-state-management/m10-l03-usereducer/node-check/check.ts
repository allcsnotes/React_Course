import { cartReducer, initialCart } from './cart.ts'

const react = { id: 'react', title: 'React', price: 499 }

let s = initialCart
s = cartReducer(s, { type: 'add', course: react })
s = cartReducer(s, { type: 'add', course: react })
s = cartReducer(s, { type: 'applyCoupon', code: 'SAVE10' })
console.log(s)
console.log(cartReducer(s, { type: 'clear' }))
console.log(initialCart.items.length)
