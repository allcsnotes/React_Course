import { useState } from 'react'
import courses from './data/courses.js'

function App() {
  const [query, setQuery] = useState('')

  const q = query.toLowerCase()
  const shown = courses.filter(c =>
    c.title.toLowerCase().includes(q)
  )

  return (
    <div className="page">
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search courses"
      />
      <p className="dim">
        {shown.length} of {courses.length} courses
      </p>
      <ul>
        {shown.map(c => (
          <li key={c.id}>{c.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
