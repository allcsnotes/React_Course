import { useState } from 'react'

const TOTAL = 3

export default function Ex09() {
  const [taken, setTaken] = useState(0)

  return (
    <div className="card">
      <h3>System Design live class</h3>
      <p>
        Seats left: {TOTAL - taken} of {TOTAL}
      </p>
      <button disabled={taken === TOTAL} onClick={() => setTaken(taken + 1)}>
        Enrol
      </button>
      <button disabled={taken === 0} onClick={() => setTaken(taken - 1)}>
        Cancel
      </button>
      {taken === TOTAL && <p className="error">Class full</p>}
    </div>
  )
}
