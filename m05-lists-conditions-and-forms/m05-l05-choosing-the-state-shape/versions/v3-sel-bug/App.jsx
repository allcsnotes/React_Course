import { useState } from 'react'
import { courses as start } from './courses.js'
import './App.css'

export default function App() {
  const [courses, setCourses] = useState(start)
  const [selectedCourse, setSelectedCourse] =
    useState(null)

  function rename() {
    setCourses(courses.map(c =>
      c.id === selectedCourse.id
        ? { ...c, title: c.title + ' Pro' }
        : c
    ))
  }

  return (
    <div className="card cols">
      <div className="list">
        {courses.map(c => (
          <button key={c.id} className="row"
            onClick={() => setSelectedCourse(c)}>{c.title}</button>
        ))}
      </div>
      {selectedCourse ? (
        <div className="panel">
          <h3>{selectedCourse.title}</h3>
          <p>by {selectedCourse.teacher}</p>
          <button onClick={rename}>Rename</button>
        </div>
      ) : (
        <div className="panel"><p>Pick a course</p></div>
      )}
    </div>
  )
}
