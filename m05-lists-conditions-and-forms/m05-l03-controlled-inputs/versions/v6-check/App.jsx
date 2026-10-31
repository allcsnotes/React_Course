import { useState } from 'react'

function App() {
  const [agree, setAgree] = useState(false)

  return (
    <div className="page">
      <label className="row">
        <input
          type="checkbox"
          checked={agree}
          onChange={e => setAgree(e.target.checked)}
        />
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
