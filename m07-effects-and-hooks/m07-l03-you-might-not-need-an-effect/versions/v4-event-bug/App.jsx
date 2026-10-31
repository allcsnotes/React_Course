import { useState, useEffect } from 'react'
import './App.css'

export default function App() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [sent, setSent] = useState(0)

  useEffect(() => {
    if (submitted) {
      console.log('send', email)
      setSent(n => n + 1)
    }
  }, [submitted, email])

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Enroll</h2>
      <label>Email
        <input value={email} onChange={e => setEmail(e.target.value)} />
      </label>
      <button type="submit" style={{ marginTop: 10 }}>Enroll</button>
      <p className="stat">Requests sent: <b>{sent}</b></p>
    </form>
  )
}
