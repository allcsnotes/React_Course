import { useState } from 'react'

function App() {
  const [agree, setAgree] = useState(false)

  function handleChange(e) {
    console.log(e.target.value)
    setAgree(e.target.value)
  }

  return (
    <div className="page">
      <label className="row">
        <input type="checkbox" checked={agree} onChange={handleChange} />
        I agree to the terms
      </label>
      <p className="dim">
        Agreed: {agree ? 'yes' : 'no'}
      </p>
      <button disabled={!agree}>Enroll</button>
    </div>
  )
}

export default App
