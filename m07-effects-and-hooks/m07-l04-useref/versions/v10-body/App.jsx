import { useRef } from 'react'

function App() {
  const boxRef = useRef(null)
  boxRef.current.focus()

  return (
    <div className="page">
      <input
        ref={boxRef}
        placeholder="Search courses"
      />
    </div>
  )
}

export default App
