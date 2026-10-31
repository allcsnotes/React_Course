import { useState } from 'react'
import './App.css'
import courses from './data/courses.js'

function Badge({ count }) {
  console.log('Badge ran, count is', count)
  if (count === 0) return null
  return <b>{count}</b>
}

export default function App() {
  const [count, setCount] = useState(2)

  return (
    <>
      <header>
        <b className="logo">allcsvideos</b>
        <span className="badge">
          My courses <Badge count={count} />
        </span>
      </header>
      <div className="card">
        <h2>My courses</h2>
        <ul>
          {courses.slice(0, count).map(c => (
            <li key={c.id}>{c.title}</li>
          ))}
        </ul>
        <p>Courses joined: {count}</p>
        <button onClick={() => setCount(count - 1)}>
          Leave a course
        </button>
      </div>
    </>
  )
}
