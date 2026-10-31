import { useState } from 'react'
import './App.css'
import courses from './data/courses.js'

const messages = {
  loading: <p className="msg">Loading…</p>,
  error: <p className="bad">Could not load</p>,
  empty: <p className="msg">No courses yet</p>,
}

function Courses({ status }) {
  if (status !== 'ready') {
    return messages[status]
  }
  return (
    <ul>
      {courses.map(c => (
        <li key={c.id}>{c.title}</li>
      ))}
    </ul>
  )
}

export default function App() {
  const [status, setStatus] = useState('loading')

  return (
    <>
      <div className="tabs">
        {['loading', 'error', 'empty', 'ready'].map(s => (
          <button
            key={s}
            className={s === status ? 'on' : ''}
            onClick={() => setStatus(s)}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="card">
        <h2>Courses</h2>
        <Courses status={status} />
      </div>
    </>
  )
}
