import { useState } from 'react'
import './App.css'

export default function App() {
  const [enrolled, setEnrolled] = useState(false)

  return (
    <div className="card">
      <h2>React for Beginners</h2>
      <p>by Meera · 12 lessons</p>
      {enrolled ? (
        <p className="done">You are enrolled</p>
      ) : (
        <button onClick={() => setEnrolled(true)}>
          Enroll
        </button>
      )}
    </div>
  )
}
