import { useState } from 'react'
import { useDebounce } from './useDebounce.js'
import { useFetch } from './useFetch.js'
import './App.css'

export default function App() {
  const [text, setText] = useState('')
  const debounced = useDebounce(text, 400)
  const api = 'http://localhost:8176/api/courses'
  const { data, status, error } = useFetch(
    `${api}?q=${debounced}&delay=600`
  )

  return (
    <div className="card">
      <h2>Search courses</h2>
      <input
        placeholder="Search"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      {status === 'loading' && <p className="note">Searching...</p>}
      {status === 'error' && <p className="err">{error}</p>}
      {status === 'success' && (
        <ul>
          {data.map(c => <li key={c.id}>{c.title}</li>)}
        </ul>
      )}
    </div>
  )
}
