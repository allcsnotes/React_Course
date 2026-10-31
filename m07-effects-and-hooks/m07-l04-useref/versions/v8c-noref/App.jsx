import { useRef } from 'react'

function TextField({ label }) {
  return (
    <label>
      {label}
      <input />
    </label>
  )
}

function App() {
  const emailRef = useRef(null)

  function focusEmail() {
    emailRef.current.focus()
  }

  return (
    <div className="page">
      <TextField label="Email" ref={emailRef} />
      <button onClick={focusEmail}>
        Focus email
      </button>
    </div>
  )
}

export default App
