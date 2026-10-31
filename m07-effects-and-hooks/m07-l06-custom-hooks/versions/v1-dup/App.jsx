import { useState, useEffect } from 'react'
import './App.css'

function NameBox() {
  const [name, setName] = useState(() => {
    const saved = localStorage.getItem('name')
    return saved ? JSON.parse(saved) : ''
  })

  useEffect(() => {
    localStorage.setItem('name', JSON.stringify(name))
  }, [name])

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
  const [note, setNote] = useState(() => {
    const saved = localStorage.getItem('note')
    return saved ? JSON.parse(saved) : ''
  })

  useEffect(() => {
    localStorage.setItem('note', JSON.stringify(note))
  }, [note])

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
  const [goal, setGoal] = useState(() => {
    const saved = localStorage.getItem('goal')
    return saved ? JSON.parse(saved) : ''
  })

  useEffect(() => {
    localStorage.setItem('goal', JSON.stringify(goal))
  }, [goal])

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
