import { useState } from 'react'

export default function Ex08() {
  const [name, setName] = useState('nobody')

  return (
    <div className="card">
      <p>Hello, {name}!</p>
      <button onClick={() => setName('Asha')}>Asha</button>
      <button onClick={() => setName('Lukas')}>Lukas</button>
      <button onClick={() => setName('Priya')}>Priya</button>
    </div>
  )
}
