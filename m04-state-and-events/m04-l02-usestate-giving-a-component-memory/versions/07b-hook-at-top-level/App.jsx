import { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)
  const [note, setNote] = useState('hello')

  return (
    <div className="counter">
      <p>Count: {count}</p>
      {count > 0 && <p>{note}</p>}
      <button onClick={() => setCount(count + 1)}>
        Add one
      </button>
    </div>
  )
}
