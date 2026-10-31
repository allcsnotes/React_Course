import { useEffect, useState } from 'react'
import useDebounce from './hooks/useDebounce'

function searchUrl(q) {
  return '/api/courses?q=' + encodeURIComponent(q)
}

export default function App() {
  const [query, setQuery] = useState('')
  const term = useDebounce(query.trim(), 1500)
  const [status, setStatus] = useState('idle')
  const [items, setItems] = useState([])

  useEffect(() => {
    if (term === '') {
      setStatus('idle')
      return
    }
    setStatus('loading')
    fetch(searchUrl(term))
      .then(res => res.json())
      .then(data => {
        setItems(data.items)
        setStatus('done')
      })
  }, [term])

  return (
    <main className="search">
      <h1>Find a course</h1>
      <div className="box">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search courses"
        />
      </div>
      {status === 'loading' && (
        <p className="status">Searching...</p>
      )}
      {status === 'done' && (
        <ul>
          {items.map(c => (
            <li key={c.id}>{c.title}</li>
          ))}
        </ul>
      )}
    </main>
  )
}
