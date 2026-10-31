import { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)

  if (count > 0) {
    const [note, setNote] = useState('hello')
  }

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
