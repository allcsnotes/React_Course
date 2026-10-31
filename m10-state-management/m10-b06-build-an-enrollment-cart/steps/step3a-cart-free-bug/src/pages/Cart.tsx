import { Link } from 'react-router'
import { useCartStore } from '../cart/cartStore'
import { getTotals } from '../cart/totals'
import formatPrice from '../utils/formatPrice'

export default function Cart() {
  const items = useCartStore((state) => state.items)
  const coupon = useCartStore((state) => state.coupon)
  const remove = useCartStore((state) => state.remove)
  const totals = getTotals(items, coupon)

  if (items.length === 0) {
    return (
      <>
        <h1>Your cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/">Browse the courses</Link>
      </>
    )
  }

  return (
    <>
      <h1>Your cart</h1>
      <ul className="lines">
        {items.map((item) => (
          <li key={item.slug}>
            <span>{item.title}</span>
            <span>{formatPrice(item.price)}</span>
            <button
              className="ghost"
              onClick={() => remove(item.slug)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <dl className="totals">
        <dt>Subtotal</dt>
        <dd>{formatPrice(totals.subtotal)}</dd>
        <dt>Discount</dt>
        <dd>- {formatPrice(totals.discount)}</dd>
        <dt>Total</dt>
        <dd>{formatPrice(totals.total)}</dd>
      </dl>
    </>
  )
}
