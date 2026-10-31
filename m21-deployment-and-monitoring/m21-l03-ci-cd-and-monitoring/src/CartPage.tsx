import { useState } from 'react'
import { Receipt } from './Receipt.tsx'
import { total, type Item } from './totals.ts'

const items: Item[] = [
  { slug: 'react', title: 'React for Beginners', price: 499 },
  { slug: 'sql', title: 'SQL in Two Weeks', price: 399 },
]

export function CartPage() {
  const [receipt, setReceipt] = useState(false)
  const [coupon, setCoupon] = useState('')

  function printLast() {
    const last = items[items.length]
    console.log(`Printing ${last.title}`)
  }

  return (
    <main>
      <h1>Your cart</h1>
      <ul>
        {items.map((item) => (
          <li key={item.slug}>
            <b>{item.title}</b>
            <span>₹{item.price}</span>
          </li>
        ))}
      </ul>
      <p className="total">Total: ₹{total(items)}</p>
      <input
        aria-label="Coupon"
        placeholder="Coupon code"
        value={coupon}
        onChange={(e) => setCoupon(e.target.value)}
      />
      <div className="row">
        <button onClick={() => setReceipt(!receipt)}>Receipt</button>
        <button onClick={printLast}>Print</button>
      </div>
      {receipt && <Receipt items={items} />}
    </main>
  )
}
