import { useState } from 'react'

function App() {
  const [msg, setMsg] = useState('Nothing yet')
  const enroll = () => setMsg('Enrolled!')
  const save = () => setMsg('Saved!')

  return (
    <div className="page">
      <h2>Python from Zero</h2>
      <div className="row">
        <button className="btn" onClick={enroll}>
          Enroll
        </button>
        <button className="ghost" onClick={save}>
          Save for later
        </button>
      </div>
      <p className="out">{msg}</p>
    </div>
  )
}

export default App
