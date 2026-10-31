import { useState, useEffect } from 'react'
import { courses } from './courses.js'
import './App.css'

let renders = 0

function Notes({ course }) {
  const [note, setNote] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setNote('')
  }, [course.id])

  console.log('render', ++renders, course.title, note)

  return (
    <div className="panel">
      <h3>{course.title}</h3>
      <input placeholder="My note" value={note}
        onChange={e => setNote(e.target.value)} />
      <label className="check">
        <input type="checkbox" checked={done}
          onChange={e => setDone(e.target.checked)} /> Finished
      </label>
    </div>
  )
}

export default function App() {
  const [id, setId] = useState(2)
  const course = courses.find(c => c.id === id)

  return (
    <div className="card cols">
      <div className="list">
        {courses.map(c => (
          <button key={c.id} className="row"
            onClick={() => setId(c.id)}>{c.title}</button>
        ))}
      </div>
      <Notes course={course} />
    </div>
  )
}
