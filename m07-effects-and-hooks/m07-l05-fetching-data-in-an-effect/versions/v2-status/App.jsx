import { useState, useEffect } from 'react'
import './App.css'

export default function App() {
  const [courses, setCourses] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/courses')
        if (!res.ok) throw new Error('Not ok')
        setCourses(await res.json())
        setStatus('ready')
      } catch (err) {
        setStatus('error')
      }
    }
    load()
  }, [])

  return (
    <div className="card">
      <h2>Courses</h2>
      {status === 'loading' && (
        <p className="note">Loading courses...</p>
      )}
      {status === 'error' && (
        <p className="err">Could not load courses.</p>
      )}
      {status === 'ready' && courses.length === 0 && (
        <p className="note">No courses yet.</p>
      )}
      <ul>
        {courses.map(c => <li key={c.id}>{c.title}</li>)}
      </ul>
    </div>
  )
}
