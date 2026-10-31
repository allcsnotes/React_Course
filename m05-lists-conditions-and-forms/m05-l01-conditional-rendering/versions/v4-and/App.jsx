import { useState } from 'react'
import './App.css'

export default function App() {
  const [open, setOpen] = useState(false)

  return (
    <div className="card">
      <h2>React for Beginners</h2>
      <p>by Meera</p>
      {open && (
        <p className="more">12 lessons · Rs 499</p>
      )}
      <button onClick={() => setOpen(!open)}>
        {open ? 'Hide details' : 'Show details'}
      </button>
    </div>
  )
}
