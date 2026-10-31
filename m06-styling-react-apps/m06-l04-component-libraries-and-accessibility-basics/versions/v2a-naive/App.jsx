import { useState } from 'react'

function App() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <div className="page low">
      <h2>Python from Zero</h2>
      <div className="row">
        <button className="btn" onClick={() => setOpen(true)}>
          Enroll
        </button>
        <button className="ghost">Save for later</button>
      </div>
      {open && (
        <div className="naive">
          <div className="dialog">
            <h3>Enroll in Python from Zero?</h3>
            <div className="row">
              <button className="btn" onClick={close}>
                Yes, enroll
              </button>
              <button className="ghost" onClick={close}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
