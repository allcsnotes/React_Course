import { useState } from 'react'

function App() {
  const [name, setName] = useState('Lukas')
  console.log('drawing')

  return (
    <div className="page">
      <label htmlFor="name">Controlled</label>
      <input id="name" value={name} onChange={e => setName(e.target.value)} />
    </div>
  )
}

export default App
