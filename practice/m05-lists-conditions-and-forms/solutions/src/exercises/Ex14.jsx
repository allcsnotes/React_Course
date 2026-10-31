import { useState } from 'react'

export default function Ex14() {
  const [lessons, setLessons] = useState([
    { id: 1, title: 'What React is', done: true },
    { id: 2, title: 'Setting up your tools', done: false },
    { id: 3, title: 'Components', done: false },
    { id: 4, title: 'Props', done: false },
  ])

  function toggle(id) {
    setLessons(lessons.map((l) => (l.id === id ? { ...l, done: !l.done } : l)))
  }

  const doneCount = lessons.filter((l) => l.done).length

  return (
    <div className="card">
      <h3>Rahul's checklist</h3>
      <p>
        {doneCount} of {lessons.length} done
      </p>
      {lessons.map((l) => (
        <div key={l.id} className="row">
          <span>
            {l.done ? '[x]' : '[ ]'} {l.title}
          </span>
          <button onClick={() => toggle(l.id)}>{l.done ? 'Undo' : 'Done'}</button>
        </div>
      ))}
    </div>
  )
}
