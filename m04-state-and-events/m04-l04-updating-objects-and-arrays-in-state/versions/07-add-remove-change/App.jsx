import { useState } from 'react'
import courses from './courses'

export default function App() {
  const [enrolled, setEnrolled] = useState([])

  function enroll(course) {
    setEnrolled([
      ...enrolled,
      { ...course, done: false },
    ])
  }

  function remove(id) {
    setEnrolled(
      enrolled.filter(c => c.id !== id)
    )
  }

  function toggleDone(id) {
    setEnrolled(enrolled.map(c =>
      c.id === id ? { ...c, done: !c.done } : c
    ))
  }

  return (
    <div className="page">
      <div className="cols">
        <div className="col">
          <h2>Catalog</h2>
          {courses.map(c => (
            <div className="row" key={c.id}>
              <span>{c.title}</span>
              <button
                disabled={enrolled.some(e => e.id === c.id)}
                onClick={() => enroll(c)}
              >
                Enroll
              </button>
            </div>
          ))}
        </div>
        <div className="col">
          <h2>Lukas's courses ({enrolled.length})</h2>
          {enrolled.length === 0 && <p className="empty">nothing yet</p>}
          {enrolled.map(c => (
            <div className="item" key={c.id}>
              <div className={c.done ? 't done' : 't'}>{c.title}</div>
              <div className="b">
                <button className="ghost" onClick={() => toggleDone(c.id)}>Done</button>
                <button className="warn" onClick={() => remove(c.id)}>Remove</button>
                {c.done && <span className="tag">done</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
