import { useState, useEffect } from 'react'
import './App.css'

export default function App() {
  const [count, setCount] = useState(0)
  const [note, setNote] = useState('')

  console.log('render:', count, note)

  useEffect(() => console.log('A'))
  useEffect(() => console.log('B'), [])
  useEffect(() => console.log('C'), [count])

  return (
    <div className="card">
      <h2>allcsvideos</h2>
      <p>Items in cart: {count}</p>
      <div className="bar">
        <input placeholder="Type a note" value={note}
          onChange={e => setNote(e.target.value)} />
        <button onClick={() => setCount(count + 1)}>
          Add to cart
        </button>
      </div>
    </div>
  )
}
