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

  function sortByLessons() {
    setEnrolled(
      enrolled.toSorted(
        (a, b) => a.lessons - b.lessons
      )
    )
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
              <div className="t">{c.title}</div>
              <div className="sub">{c.lessons} lessons</div>
            </div>
          ))}
          <div className="item"><button className="ghost" onClick={sortByLessons}>Sort by lessons</button></div>
        </div>
      </div>
    </div>
  )
}
