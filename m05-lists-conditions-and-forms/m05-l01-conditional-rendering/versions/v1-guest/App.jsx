import { useState } from 'react'
import './App.css'

function Welcome({ user, onSignIn, onSignOut }) {
  if (user === null) {
    return (
      <button onClick={onSignIn}>Sign in</button>
    )
  }
  return (
    <span className="who">
      Hi, {user}
      <button onClick={onSignOut}>Sign out</button>
    </span>
  )
}

export default function App() {
  const [user, setUser] = useState(null)

  return (
    <>
      <header>
        <b className="logo">allcsvideos</b>
        <Welcome
          user={user}
          onSignIn={() => setUser('Lukas')}
          onSignOut={() => setUser(null)}
        />
      </header>
      <div className="card">
        <h2>React for Beginners</h2>
        <p>by Meera · 12 lessons</p>
      </div>
    </>
  )
}
