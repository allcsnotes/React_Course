import { useState } from 'react'
import { Link } from 'react-router'
import { fmt, placeOrder, type Order } from './api'
import { useCart } from './CartContext'
import { getTotals, knownCoupon } from './totals'

export default function Cart() {
  const { items, remove, clear } = useCart()
  const [code, setCode] = useState('')
  const [applied, setApplied] = useState('')
  const [bad, setBad] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)
  const t = getTotals(items, applied)

  if (order)
    return (
      <>
        <h1>Order confirmed</h1>
        <p>Order {order.id} · {order.courses} courses · {fmt(order.total)}</p>
      </>
    )
  if (items.length === 0)
    return (
      <>
        <h1>Your cart</h1>
        <p>Your cart is empty. <Link to="/">Back to the courses</Link></p>
      </>
    )

  function apply() {
    const c = code.trim().toUpperCase()
    setBad(!knownCoupon(c))
    setApplied(knownCoupon(c) ? c : '')
  }
  async function pay() {
    const o = await placeOrder(items.map(i => i.slug), applied)
    setOrder(o)
    clear()
  }

  return (
    <>
      <h1>Your cart</h1>
      <div className="two">
        <section>
          <ul className="list">
            {items.map(i => (
              <li className="card" key={i.slug}>
                <strong>{i.title}</strong>
                <span>{fmt(i.price)}</span>
                <button onClick={() => remove(i.slug)}>Remove</button>
              </li>
            ))}
          </ul>
          <div className="row">
            <label>
              Coupon code
              <input value={code} onChange={e => setCode(e.target.value)} />
            </label>
            <button onClick={apply}>Apply</button>
          </div>
          {bad && <p role="alert">That code does not exist</p>}
        </section>
        <aside className="card sum">
          <p>Subtotal: {fmt(t.subtotal)}</p>
          {applied && <p>Discount: Rs {t.discount}</p>}
          <p><b>Total: {fmt(t.total)}</b></p>
          <button className="pay" onClick={pay}>Pay now</button>
        </aside>
      </div>
    </>
  )
}
