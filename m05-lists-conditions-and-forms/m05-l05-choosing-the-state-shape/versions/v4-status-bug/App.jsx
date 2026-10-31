import { useState } from 'react'
import { fakeFetch } from './api.js'
import './App.css'

export default function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [items, setItems] = useState([])

  async function load() {
    setIsLoading(true)
    try {
      setItems(await fakeFetch())
      setIsSuccess(true)
    } catch (err) {
      setIsError(true)
    }
    setIsLoading(false)
  }

  return (
    <div className="card">
      <button onClick={load}>Load courses</button>
      {isLoading && <p className="note">Loading...</p>}
      {isError && <p className="err">Could not load.</p>}
      {isSuccess && (
        <ul>{items.map(c => <li key={c.id}>{c.title}</li>)}</ul>
      )}
    </div>
  )
}
