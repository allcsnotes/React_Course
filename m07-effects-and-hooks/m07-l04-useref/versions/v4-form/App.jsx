import { useState, useRef } from 'react'

function App() {
  const nameRef = useRef(null)
  const [sent, setSent] = useState('')
  console.log('drawing')

  function handleSubmit(e) {
    e.preventDefault()
    setSent(nameRef.current.value)
  }

  return (
    <form className="page" onSubmit={handleSubmit}>
      <input ref={nameRef} defaultValue="Lukas" />
      <button>Send</button>
      <p className="out">
        {sent ? `Hello, ${sent}` : 'Not sent yet'}
      </p>
    </form>
  )
}

export default App
