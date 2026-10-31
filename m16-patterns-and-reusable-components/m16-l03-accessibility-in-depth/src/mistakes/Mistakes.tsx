import { useState } from 'react'

// Mistake 1: a role is only a label. The keys are still yours.
export function M1() {
  const [done, setDone] = useState(false)
  return (
    <div className="page big">
      <h1>Python from Zero</h1>
      <p className="by">by Meera · 40 lessons</p>
      <div className="row">
        <div
          role="button"
          tabIndex={0}
          className="fake"
          onClick={() => setDone(true)}
        >
          Enroll
        </div>
      </div>
      <div role="status" className="toast">{done ? 'Enrolled' : ''}</div>
      <p className="panel">40 lessons, one project.</p>
    </div>
  )
}

// Mistake 2: aria-hidden on something that can take focus
export function M2() {
  return (
    <div className="page big">
      <h1>Python from Zero</h1>
      <p className="by">by Meera · 40 lessons</p>
      <div
        aria-hidden="true"
        className="row"
      >
        <button>Enroll</button>
        <button className="plain">Cancel</button>
      </div>
      <p className="panel">40 lessons, one project.</p>
    </div>
  )
}

// Mistake 3: a positive tabindex
export function M3() {
  return (
    <div className="page big">
      <h1>Python from Zero</h1>
      <p className="by">by Meera · 40 lessons</p>
      <div className="row">
        <button>Enroll</button>
        <button className="plain">Preview</button>
        <button
          className="plain"
          tabIndex={1}
        >
          Wishlist
        </button>
      </div>
      <p className="panel">40 lessons, one project.</p>
    </div>
  )
}
