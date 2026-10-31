import { useState, useRef } from 'react'

function App() {
  const [query, setQuery] = useState('')
  const boxRef = useRef(null)

  function clear() {
    setQuery('')
    boxRef.current.focus()
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
