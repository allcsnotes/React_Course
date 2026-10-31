import { useState } from 'react'
import { courses as start } from './courses.js'
import './App.css'

export default function App() {
  const [courses, setCourses] = useState(start)
  const [query, setQuery] = useState('')

  const text = query.toLowerCase()
  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(text)
  )

  function addCourse() {
    const pro = { id: 5, title: 'Python Pro' }
    setCourses([...courses, pro])
  }

  return (
    <div className="card">
      <div className="bar">
        <input value={query}
          onChange={e => setQuery(e.target.value)} placeholder="Search" />
        <button onClick={addCourse}>Add Python Pro</button>
      </div>
      <ul>
        {filteredCourses.map(c => <li key={c.id}>{c.title}</li>)}
      </ul>
      <p className="small">{courses.length} courses in total</p>
    </div>
  )
}
