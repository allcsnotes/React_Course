import { useEffect, useState } from 'react'
import { Receipt } from './Receipt.tsx'

export type Item = { slug: string; title: string; price: number }

export function CartPage() {
  const [items, setItems] = useState<Item[]>([])
  const [receipt, setReceipt] = useState(false)

  useEffect(() => {
    fetch('http://localhost:8183/api/cart')
      .then((res) => res.json())
      .then((data) => setItems(data.items))
  }, [])

  const total = items.reduce((sum, item) => {
    return sum + item.price
  }, 0)

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
      <p className="total">Total: ₹{total}</p>
      <div className="row">
        <button onClick={() => setReceipt(!receipt)}>Receipt</button>
        <button onClick={printLast}>Print</button>
      </div>
      {receipt && <Receipt items={items} />}
    </main>
  )
}
