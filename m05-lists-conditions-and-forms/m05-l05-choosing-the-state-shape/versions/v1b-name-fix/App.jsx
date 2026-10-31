import { useState } from 'react'
import './App.css'

export default function App() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const fullName = firstName + ' ' + lastName

  return (
    <div className="card">
      <h2>Sign up</h2>
      <label>First name
        <input value={firstName}
          onChange={e => setFirstName(e.target.value)} />
      </label>
      <label>Last name
        <input value={lastName}
          onChange={e => setLastName(e.target.value)} />
      </label>
      <p className="big">Hello, {fullName}!</p>
    </div>
  )
}
