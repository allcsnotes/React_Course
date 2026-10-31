import { useState, type FormEvent } from 'react'
import { courses } from '../data.ts'
import { COUPONS, getTotals } from '../lib/totals.ts'

// A cart page piece with local state only: the typed code, the message, and the applied coupon.
export default function Ex19() {
  const items = courses.slice(0, 2)
  const [coupon, setCoupon] = useState<string | null>(null)
  const [typed, setTyped] = useState('')
  const [message, setMessage] = useState('')

  // The numbers are derived while drawing. They are never stored.
  const { subtotal, discount, total } = getTotals(
    items.map((c) => c.price),
    coupon,
  )

  function apply(e: FormEvent) {
    e.preventDefault()
    const code = typed.trim().toUpperCase() // 'save10' is the same as 'SAVE10'
    if (!(code in COUPONS)) {
      setMessage(`${code} is not a coupon`)
      return
    }
    setCoupon(code)
    setTyped('')
    setMessage('')
  }

  return (
    <div className="card">
      {items.map((c) => (
        <div key={c.id}>
          {c.title} · Rs {c.price}
        </div>
      ))}
      <p>Subtotal: Rs {subtotal}</p>
      <p>Discount: -Rs {discount}</p>
      <p>
        <strong>Total: Rs {total}</strong>
      </p>
      {coupon !== null ? (
        <p>
          <span className="chip">Coupon {coupon}</span> <button onClick={() => setCoupon(null)}>Remove coupon</button>
        </p>
      ) : (
        <form onSubmit={apply}>
          <input type="text" value={typed} placeholder="Coupon code" onChange={(e) => setTyped(e.target.value)} />
          <button type="submit">Apply</button>
          {message !== '' && <p className="error">{message}</p>}
        </form>
      )}
    </div>
  )
}
