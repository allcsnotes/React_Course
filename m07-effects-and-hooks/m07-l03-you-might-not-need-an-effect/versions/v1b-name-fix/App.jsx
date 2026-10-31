import { useState } from 'react'
import './App.css'

let renders = 0

export default function App() {
  const [first, setFirst] = useState('')
  const [last, setLast] = useState('')
  const full = first + ' ' + last

  console.log('render', ++renders, first, '->', full)

  return (
    <div className="card">
      <h2>Sign up</h2>
      <label>First name
        <input value={first} onChange={e => setFirst(e.target.value)} />
      </label>
      <label>Last name
        <input value={last} onChange={e => setLast(e.target.value)} />
      </label>
      <p className="big">Hello, {full}!</p>
    </div>
  )
}
