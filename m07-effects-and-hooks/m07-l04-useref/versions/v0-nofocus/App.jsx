import { useState } from 'react'

function App() {
  const [query, setQuery] = useState('')

  function clear() {
    setQuery('')
  }

  return (
    <div className="page">
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search courses"
      />
      <button onClick={clear}>Clear</button>
    </div>
  )
}

export default App
