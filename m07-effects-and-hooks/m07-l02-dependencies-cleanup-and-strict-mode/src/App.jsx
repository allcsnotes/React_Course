import { useState, useEffect } from 'react'
import { courses } from './courses.js'
import './App.css'

function CoursePage({ courseId }) {
  const course = courses.find(
    c => c.id === courseId,
  )

  useEffect(() => {
    document.title =
      course.title + ' | allcsvideos'
  }, [])

  return <h2 className="big">{course.title}</h2>
}

export default function App() {
  const [courseId, setCourseId] = useState(2)

  return (
    <div className="card">
      <div className="bar">
        <button onClick={() => setCourseId(2)}>Python</button>
        <button onClick={() => setCourseId(1)}>React</button>
        <button onClick={() => setCourseId(4)}>DevOps</button>
      </div>
      <CoursePage courseId={courseId} />
    </div>
  )
}
