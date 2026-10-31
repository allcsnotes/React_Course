import { useLocalStorage } from './useLocalStorage.js'
import './App.css'

export default function App() {
  function save() {
    const [note, setNote] = useLocalStorage('note', '')
  }

  return (
    <div className="card">
      <h2>Settings</h2>
      <button onClick={save}>Save note</button>
    </div>
  )
}
