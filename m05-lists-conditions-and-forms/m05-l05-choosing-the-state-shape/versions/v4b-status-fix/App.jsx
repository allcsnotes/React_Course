import { useState } from 'react'
import { fakeFetch } from './api.js'
import './App.css'

export default function App() {
  const [status, setStatus] = useState('idle')
  const [items, setItems] = useState([])

  async function load() {
    setStatus('loading')
    try {
      setItems(await fakeFetch())
      setStatus('done')
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <div className="card">
      <button onClick={load}>Load courses</button>
      {status === 'loading' && <p className="note">Loading...</p>}
      {status === 'error' && <p className="err">Could not load.</p>}
      {status === 'done' && (
        <ul>{items.map(c => <li key={c.id}>{c.title}</li>)}</ul>
      )}
    </div>
  )
}
