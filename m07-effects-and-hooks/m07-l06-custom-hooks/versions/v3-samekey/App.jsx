import { useLocalStorage } from './useLocalStorage.js'
import './App.css'

function Box({ label }) {
  const [name, setName] = useLocalStorage('name', '')

  return (
    <label>
      {label}
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
    </label>
  )
}

export default function App() {
  return (
    <div className="card">
      <h2>Same key, twice</h2>
      <Box label="First box" />
      <Box label="Second box" />
    </div>
  )
}
