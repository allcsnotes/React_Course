import { useState, useEffect } from 'react'
import { courses } from './courses.js'
import './App.css'

let renders = 0
const matches = (c, q) => c.title.toLowerCase().includes(q.toLowerCase())

export default function App() {
  const [query, setQuery] = useState('')
  const [shown, setShown] = useState(courses)

  useEffect(() => {
    setShown(courses.filter(c => matches(c, query)))
  }, [query])

  console.log('render', ++renders, query, shown.length)

  return (
    <div className="card">
      <input placeholder="Search" value={query}
        onChange={e => setQuery(e.target.value)} />
      <p className="stat"><b>{shown.length}</b> of {courses.length} courses</p>
      <ul>
        {shown.map(c => <li key={c.id}>{c.title}</li>)}
      </ul>
    </div>
  )
}
