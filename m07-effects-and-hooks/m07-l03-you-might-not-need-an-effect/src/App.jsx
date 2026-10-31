import { useState, useEffect } from 'react'
import { courses } from './courses.js'
import './App.css'

export default function App() {
  const [id, setId] = useState(2)
  const course = courses.find(c => c.id === id)

  useEffect(() => {
    document.title = course.title + ' | allcsvideos'
  }, [course.title])

  return (
    <div className="card cols">
      <div className="list">
        {courses.map(c => (
          <button key={c.id} className="row"
            onClick={() => setId(c.id)}>{c.title}</button>
        ))}
      </div>
      <div className="panel">
        <h3>{course.title}</h3>
        <p>by {course.teacher}</p>
      </div>
    </div>
  )
}
