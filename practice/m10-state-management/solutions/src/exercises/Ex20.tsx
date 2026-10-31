import { useState, type FormEvent } from 'react'
import { courses } from '../data.ts'
import { getTotals } from '../lib/totals.ts'
import { useCart20 } from '../lib/cartStore20.ts'

function slugOf(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

function Badge() {
  const count = useCart20((s) => s.items.length)
  return <h3>Cart ({count})</h3>
}

function AddToCart({ title, price }: { title: string; price: number }) {
  const slug = slugOf(title)
  const inCart = useCart20((s) => s.items.some((i) => i.slug === slug)) // a yes or no
  const add = useCart20((s) => s.add)
  return (
    <button disabled={inCart} onClick={() => add({ slug, title, price })}>
      {inCart ? 'In cart' : 'Add to cart'}
    </button>
  )
}

function CartPage() {
  const items = useCart20((s) => s.items)
  const coupon = useCart20((s) => s.coupon)
  const remove = useCart20((s) => s.remove)
  const applyCoupon = useCart20((s) => s.applyCoupon)
  const removeCoupon = useCart20((s) => s.removeCoupon)
  const [typed, setTyped] = useState('')
  const [message, setMessage] = useState('')

  const { subtotal, discount, total } = getTotals(
    items.map((i) => i.price),
    coupon,
  )

  function apply(e: FormEvent) {
    e.preventDefault()
    const code = typed.trim().toUpperCase()
    applyCoupon(code)
    if (useCart20.getState().coupon === code) {
      setTyped('')
      setMessage('')
    } else {
      setMessage(`${code} is not a coupon`)
    }
  }

  if (items.length === 0) return <p>Your cart is empty.</p>

  return (
    <div>
      {items.map((i) => (
        <div key={i.slug}>
          {i.title} · Rs {i.price} <button onClick={() => remove(i.slug)}>Remove</button>
        </div>
      ))}
      <p>Subtotal: Rs {subtotal}</p>
      <p>Discount: -Rs {discount}</p>
      <p>
        <strong>Total: Rs {total}</strong>
      </p>
      {coupon !== null ? (
        <p>
          <span className="chip">Coupon {coupon}</span> <button onClick={removeCoupon}>Remove coupon</button>
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

export default function Ex20() {
  return (
    <div className="card">
      <Badge />
      {courses.slice(0, 3).map((c) => (
        <div key={c.id}>
          {c.title} · Rs {c.price} <AddToCart title={c.title} price={c.price} />
        </div>
      ))}
      <hr />
      <CartPage />
    </div>
  )
}
