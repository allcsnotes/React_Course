import { useState, useEffect } from 'react'
import './App.css'

export default function App() {
  const [query, setQuery] = useState('')
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      try {
        const q = encodeURIComponent(query)
        const url = '/api/courses?q=' + q
        const res = await fetch(url, {
          signal: controller.signal,
        })
        setCourses(await res.json())
      } catch (err) {
        if (err.name === 'AbortError') return
        console.error(err)
      }
    }
    load()
    return () => controller.abort()
  }, [query])

  return (
    <div className="card">
      <input value={query} placeholder="Search"
        onChange={e => setQuery(e.target.value)} />
      <ul>
        {courses.map(c => <li key={c.id}>{c.title}</li>)}
      </ul>
    </div>
  )
}
