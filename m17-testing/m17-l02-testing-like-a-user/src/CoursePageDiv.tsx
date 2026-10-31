import { useState } from 'react'

export function CoursePageDiv() {
  const [done, setDone] = useState(false)
  return (
    <main>
      <h1>Python from Zero</h1>
      <button aria-pressed="false">Save course</button>
      <form>
        <label>
          Email
          <input type="email" />
        </label>
        <div className="btn" onClick={() => setDone(true)}>
          Enroll now
        </div>
      </form>
      <div className="slot">{done && <p role="status">You are enrolled</p>}</div>
      <h2>Lessons</h2>
      <ul>
        <li>What is programming</li>
        <li>Your first program</li>
        <li>Variables</li>
      </ul>
    </main>
  )
}
