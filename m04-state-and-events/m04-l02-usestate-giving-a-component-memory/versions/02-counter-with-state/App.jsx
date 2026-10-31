import { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setCount(count + 1)
  }

  return (
    <div className="counter">
      <h2>Counter</h2>
      <p>Count: {count}</p>
      <button onClick={handleClick}>
        Add one
      </button>
    </div>
  )
}
