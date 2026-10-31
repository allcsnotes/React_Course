import { useState } from 'react'

export default function App() {
  const [setCount, count] = useState(0)

  return (
    <div className="counter">
      <h2>Counter</h2>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Add one
      </button>
    </div>
  )
}
