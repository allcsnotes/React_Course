import { useState } from 'react'
import './App.css'

export default function App() {
  const [user, setUser] = useState(null)
  const login = () => setUser('Lukas')

  if (user === null) {
    return <button onClick={login}>Sign in</button>
  }

  const [open, setOpen] = useState(false)

  return (
    <div className="card">
      <h2>Hi, {user}</h2>
      <button onClick={() => setOpen(!open)}>
        Details
      </button>
    </div>
  )
}
