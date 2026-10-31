import { useState, useEffect } from 'react'
import './App.css'

export default function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    document.title = `Cart (${count})`
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
