import { cartReducer, initialCart } from './cart.ts'

cartReducer(initialCart, { type: 'add' })
cartReducer(initialCart, { type: 'delete', id: 'sql' })
