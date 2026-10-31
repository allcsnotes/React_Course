import { useState } from 'react'

export default function Ex22() {
  const [items, setItems] = useState([
    { id: 1, title: 'React for Beginners', price: 499, qty: 1 },
    { id: 2, title: 'System Design', price: 999, qty: 1 },
  ])

  function change(id, diff) {
    setItems(items.map((i) => (i.id === id ? { ...i, qty: i.qty + diff } : i)))
  }

  // derived while rendering: no extra state
  const totalSeats = items.reduce((sum, i) => sum + i.qty, 0)
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <div className="card">
      <h3>Receipt</h3>
      {items.map((i) => (
        <div key={i.id} className="row">
          <span>
            {i.title} x {i.qty} = Rs {i.price * i.qty}
          </span>
          <button onClick={() => change(i.id, 1)}>+</button>
          <button onClick={() => change(i.id, -1)} disabled={i.qty === 0}>
            -
          </button>
        </div>
      ))}
      <p>Seats: {totalSeats}</p>
      <p>Total: Rs {total}</p>
    </div>
  )
}
