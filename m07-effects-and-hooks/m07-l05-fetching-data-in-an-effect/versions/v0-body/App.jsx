import { useState } from 'react'
import './App.css'

export default function App() {
  const [courses, setCourses] = useState([])

  fetch('/api/courses')
    .then(res => res.json())
    .then(data => setCourses(data))

  return (
    <div className="card">
      <h2>Courses</h2>
      <ul>
        {courses.map(c => <li key={c.id}>{c.title}</li>)}
      </ul>
    </div>
  )
}
