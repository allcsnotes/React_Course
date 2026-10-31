import { useState } from 'react'

const names = ['Overview', 'Lessons', 'Reviews']
const text = [
  '40 lessons, one project.',
  'Variables, loops, functions, files.',
  '4.8 stars from 312 students.',
]

export function Tabs() {
  const [on, setOn] = useState(0)
  return (
    <div>
      <div className="tabs">
        {names.map((n, i) => (
          <div
            key={n}
            className={i === on ? 'tab on' : 'tab'}
            onClick={() => setOn(i)}
          >
            {n}
          </div>
        ))}
      </div>
      <p className="panel">{text[on]}</p>
    </div>
  )
}
