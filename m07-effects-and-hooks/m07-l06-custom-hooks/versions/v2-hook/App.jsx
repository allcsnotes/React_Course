import { useLocalStorage } from './useLocalStorage.js'
import './App.css'

function NameBox() {
  const [name, setName] = useLocalStorage('name', '')

  return (
    <label>
      Your name
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
    </label>
  )
}

function NoteBox() {
  const [note, setNote] = useLocalStorage('note', '')

  return (
    <label>
      Study note
      <input
        value={note}
        onChange={e => setNote(e.target.value)}
      />
    </label>
  )
}

function GoalBox() {
  const [goal, setGoal] = useLocalStorage('goal', '')

  return (
    <label>
      Weekly goal
      <input
        value={goal}
        onChange={e => setGoal(e.target.value)}
      />
    </label>
  )
}

export default function App() {
  return (
    <div className="card">
      <h2>Settings</h2>
      <NameBox />
      <NoteBox />
      <GoalBox />
    </div>
  )
}
