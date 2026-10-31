import { useState } from 'react'
import { useLocalStorage } from './useLocalStorage.js'
import './App.css'

export default function App() {
  const [keep, setKeep] = useState(false)
  const [note, setNote] = useLocalStorage('note', '')

  return (
    <div className="card">
      <h2>Settings</h2>
      <label className="check">
        <input
          type="checkbox"
          checked={keep}
          onChange={e => setKeep(e.target.checked)}
        />
        Keep a note
      </label>
      {keep && (
        <input
          value={note}
          onChange={e => setNote(e.target.value)}
        />
      )}
    </div>
  )
}
