import { useState, useEffect } from 'react'
import './App.css'

export default function App() {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/courses')
      setCourses(await res.json())
    }
    load()
  }, [])

  return (
    <div className="card">
      <h2>Courses</h2>
      <ul>
        {courses.map(c => <li key={c.id}>{c.title}</li>)}
      </ul>
    </div>
  )
}
