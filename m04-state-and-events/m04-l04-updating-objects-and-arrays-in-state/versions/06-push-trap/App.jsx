import { useState } from 'react'
import courses from './courses'

export default function App() {
  const [enrolled, setEnrolled] = useState([])

  function enroll(course) {
    enrolled.push(course)
    console.log('enrolled has', enrolled.length)
    setEnrolled(enrolled)
  }

  return (
    <div className="page">
      <div className="cols">
        <div className="col">
          <h2>Catalog</h2>
          {courses.map(c => (
            <div className="row" key={c.id}>
              <span>{c.title}</span>
              <button onClick={() => enroll(c)}>Enroll</button>
            </div>
          ))}
        </div>
        <div className="col">
          <h2>Lukas's courses ({enrolled.length})</h2>
          {enrolled.length === 0 && <p className="empty">nothing yet</p>}
          {enrolled.map(c => (
            <div className="item" key={c.id}>
              <div className="t">{c.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
