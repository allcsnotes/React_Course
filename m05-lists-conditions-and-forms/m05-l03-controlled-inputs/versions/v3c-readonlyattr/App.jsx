import { useState } from 'react'

function App() {
  const [name] = useState('Lukas')

  return (
    <div className="page">
      <label htmlFor="name">Your name</label>
      <input id="name" value={name} readOnly />
      <p className="out">Hello, {name}!</p>
    </div>
  )
}

export default App
