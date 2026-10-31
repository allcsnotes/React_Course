import { useState, useRef } from 'react'

function App() {
  const draws = useRef(0)
  const [count, setCount] = useState(0)
  draws.current += 1

  return (
    <div className="page">
      <p className="out">Draws: {draws.current}</p>
      <p className="out">Clicks: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Click
      </button>
    </div>
  )
}

export default App
