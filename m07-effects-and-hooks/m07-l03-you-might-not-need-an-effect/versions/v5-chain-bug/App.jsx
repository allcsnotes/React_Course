import { useState, useEffect } from 'react'
import './App.css'

let renders = 0

export default function App() {
  const [points, setPoints] = useState(0)
  const [level, setLevel] = useState(1)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (points >= 10) setLevel(2)
  }, [points])

  useEffect(() => {
    if (level === 2) setMessage('Level 2 unlocked!')
  }, [level])

  console.log('render', ++renders, points, level, message)

  return (
    <div className="card">
      <h2>Quiz score</h2>
      <p className="stat">Points <b>{points}</b> · Level <b>{level}</b></p>
      <p className="note">{message}</p>
      <button onClick={() => setPoints(points + 5)}>+5 points</button>
    </div>
  )
}
