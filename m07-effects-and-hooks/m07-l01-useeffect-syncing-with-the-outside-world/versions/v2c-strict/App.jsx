import { useState, useEffect } from 'react'
import './App.css'

export default function App() {
  const [count, setCount] = useState(0)

  console.log('render: count is', count)

  useEffect(() => {
    document.title = `Cart (${count})`
    const p = document.getElementById('cart')
    console.log('effect: page says', p.textContent)
  })

  return (
    <div className="card">
      <h2>allcsvideos</h2>
      <p id="cart">Items in cart: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Add to cart
      </button>
    </div>
  )
}
