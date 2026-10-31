import { useState } from 'react'

export default function Ex17() {
  const [count, setCount] = useState(0)

  return (
    <div className="card">
      <h3>Meera's shop {count > 0 && <span className="badge">Cart: {count}</span>}</h3>
      <button onClick={() => setCount(count + 1)}>Add to cart</button>
      <button onClick={() => setCount(count - 1)} disabled={count === 0}>
        Remove one
      </button>
      {count >= 3 && <p className="ok">Bundle discount unlocked</p>}
    </div>
  )
}
