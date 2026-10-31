import { useState } from 'react'
import './App.css'

export default function App() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [fullName, setFullName] = useState('')

  function handleFirst(e) {
    setFirstName(e.target.value)
    setFullName(e.target.value + ' ' + lastName)
  }

  function handleLast(e) {
    setLastName(e.target.value)
  }

  return (
    <div className="card">
      <h2>Sign up</h2>
      <label>First name
        <input value={firstName} onChange={handleFirst} />
      </label>
      <label>Last name
        <input value={lastName} onChange={handleLast} />
      </label>
      <p className="big">Hello, {fullName}!</p>
    </div>
  )
}
