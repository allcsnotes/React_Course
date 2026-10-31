import { useState } from 'react'

function App() {
  const [name, setName] = useState('')

  return (
    <div className="page">
      <label htmlFor="name">Your name</label>
      <input
        id="name"
        value={name}
        onChange={e =>
          setName(e.target.value.toUpperCase())
        }
      />
      <p className="out">Hello, {name}!</p>
    </div>
  )
}

export default App
