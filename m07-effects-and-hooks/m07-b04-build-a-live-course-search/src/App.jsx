import { useEffect, useRef, useState } from 'react'
import useDebounce from './hooks/useDebounce'
import useLocalStorage from './hooks/useLocalStorage'
import Highlight from './components/Highlight'

function searchUrl(q) {
  return '/api/courses?q=' + encodeURIComponent(q)
}

export default function App() {
  const [query, setQuery] =
    useLocalStorage('course-search', '')
  const inputRef = useRef(null)
  const term = useDebounce(query.trim(), 300)
  const [status, setStatus] = useState('idle')
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (term === '') {
      setStatus('idle')
      return
    }
    const controller = new AbortController()
    setStatus('loading')
    fetch(searchUrl(term), {
      signal: controller.signal,
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Server said ' + res.status)
        }
        return res.json()
      })
      .then(data => {
        setItems(data.items)
        setStatus('done')
      })
      .catch(err => {
        if (err.name === 'AbortError') return
        setError(err.message)
        setStatus('error')
      })
    return () => controller.abort()
  }, [term])

  function clear() {
    setQuery('')
    inputRef.current.focus()
  }

  const count = items.length
  const word = count === 1 ? 'course' : 'courses'

  return (
    <main className="search">
      <h1>Find a course</h1>
      <div className="box">
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search courses"
        />
        {query !== '' && (
          <button onClick={clear}>Clear</button>
        )}
      </div>
      {status === 'idle' && (
        <p className="status">Type to search.</p>
      )}
      {status === 'loading' && (
        <p className="status">Searching...</p>
      )}
      {status === 'error' && (
        <p className="status bad">Error: {error}</p>
      )}
      {status === 'done' && count === 0 && (
        <p className="status">
          No course matches "{term}".
        </p>
      )}
      {status === 'done' && count > 0 && (
        <>
          <p className="status">
            {count} {word} for "{term}"
          </p>
          <ul>
            {items.map(c => (
              <li key={c.id}>
                <Highlight text={c.title} find={term} />
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  )
}
