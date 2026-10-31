import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'
import { useCartStore } from './cartStore'
import { COUPONS, getTotals } from './totals'
import formatPrice from '../../utils/formatPrice'

export default function Cart() {
  const items = useCartStore((state) => state.items)
  const coupon = useCartStore((state) => state.coupon)
  const remove = useCartStore((state) => state.remove)
  const applyCoupon = useCartStore(
    (state) => state.applyCoupon,
  )
  const removeCoupon = useCartStore(
    (state) => state.removeCoupon,
  )
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const totals = getTotals(items, coupon)

  function apply(e: FormEvent) {
    e.preventDefault()
    const clean = code.trim().toUpperCase()
    if (!(clean in COUPONS)) {
      setMessage(`${clean} is not a coupon`)
      return
    }
    applyCoupon(clean)
    setMessage('')
    setCode('')
  }

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
      <div className="summary">
        <div>
          {coupon ? (
            <p>
              Coupon <b>{coupon}</b>{' '}
              <button
                className="ghost"
                onClick={removeCoupon}
              >
                Remove
              </button>
            </p>
          ) : (
            <form onSubmit={apply}>
              <input
                value={code}
                onChange={(e) =>
                  setCode(e.target.value)
                }
                placeholder="Coupon code"
                aria-label="Coupon code"
              />{' '}
              <button>Apply</button>
              <p className="err">{message}</p>
            </form>
          )}
        </div>
        <dl className="totals">
          <dt>Subtotal</dt>
          <dd>Rs {totals.subtotal}</dd>
          <dt>Discount</dt>
          <dd>- Rs {totals.discount}</dd>
          <dt>Total</dt>
          <dd>Rs {totals.total}</dd>
        </dl>
      </div>
    </>
  )
}
