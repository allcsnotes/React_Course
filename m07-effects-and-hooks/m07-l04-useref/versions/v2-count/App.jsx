import { useState, useRef } from 'react'

function App() {
  const clicks = useRef(0)
  const [count, setCount] = useState(0)
  console.log('drawing')

  function addRef() {
    clicks.current += 1
    console.log('ref is', clicks.current)
  }

  return (
    <div className="page">
      <p className="out">Ref: {clicks.current}</p>
      <button onClick={addRef}>Add to ref</button>
      <p className="out">State: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Add to state
      </button>
    </div>
  )
}

export default App
