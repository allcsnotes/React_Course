import { useState } from 'react'
import './App.css'

const start = [
  { id: 1, title: 'Read chapter 3', done: true },
  { id: 2, title: 'Practice arrays', done: false },
  { id: 3, title: 'Watch lesson 5', done: false },
]

export default function App() {
  const [tasks, setTasks] = useState(start)
  const [filter, setFilter] = useState('all')

  function show(t) {
    if (filter === 'done') return t.done
    if (filter === 'open') return !t.done
    return true
  }
  const visible = tasks.filter(show)
  const left = tasks.filter(t => !t.done).length

  function toggle(id) {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  return (
    <div className="card">
      <h2>Study planner</h2>
      <div className="filters">
        {['all', 'open', 'done'].map(f => (
          <button key={f} className={filter === f ? 'on' : ''}
            onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <ul>
        {visible.map(t => (
          <li key={t.id} className={t.done ? 'done' : ''}>
            <span>{t.title}</span>
            <button onClick={() => toggle(t.id)}>{t.done ? 'Undo' : 'Check'}</button>
          </li>
        ))}
      </ul>
      <p className="small">{left} left</p>
    </div>
  )
}
