import { useState, useEffect } from 'react'
import { useDebounce } from './useDebounce.js'
import './App.css'

export default function App() {
  const [text, setText] = useState('')
  const debounced = useDebounce(text, 400)

  useEffect(() => {
    if (debounced) console.log('search for', debounced)
  }, [debounced])

  return (
    <div className="card">
      <h2>Search courses</h2>
      <input
        placeholder="Search"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <p className="note">typed: {text}</p>
      <p className="note">search term: {debounced}</p>
    </div>
  )
}
