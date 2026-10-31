import { useState } from 'react'
import EnrollDialog from './EnrollDialog.jsx'

function App() {
  const [msg, setMsg] = useState('Not enrolled yet')

  return (
    <div className="page low">
      <h2>Python from Zero</h2>
      <div className="row">
        <EnrollDialog
          title="Python from Zero"
          onConfirm={() => setMsg('Enrolled!')}
        />
        <button className="ghost">Save for later</button>
      </div>
      <p className="out">{msg}</p>
    </div>
  )
}

export default App
