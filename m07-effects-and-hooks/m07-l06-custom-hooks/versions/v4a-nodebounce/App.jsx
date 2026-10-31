import { useState, useEffect } from 'react'
import './App.css'

export default function App() {
  const [text, setText] = useState('')

  useEffect(() => {
    if (text) console.log('search for', text)
  }, [text])

  return (
    <div className="card">
      <h2>Search courses</h2>
      <input
        placeholder="Search"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <p className="note">typed: {text}</p>
    </div>
  )
}
