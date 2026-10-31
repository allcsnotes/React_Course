import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

const names = ['Overview', 'Lessons', 'Reviews']
const text = [
  '40 lessons, one project.',
  'Variables, loops, functions, files.',
  '4.8 stars from 312 students.',
]

export function Tabs() {
  const [on, setOn] = useState(0)
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  function onKey(e: KeyboardEvent) {
    const last = names.length - 1
    let to = -1
    if (e.key === 'ArrowRight') to = on === last ? 0 : on + 1
    if (e.key === 'ArrowLeft') to = on === 0 ? last : on - 1
    if (e.key === 'Home') to = 0
    if (e.key === 'End') to = last
    if (to < 0) return
    e.preventDefault()
    setOn(to)
    refs.current[to]?.focus()
  }

  return (
    <div>
      <div role="tablist" aria-label="Course" onKeyDown={onKey}>
        {names.map((n, i) => (
          <button
            key={n}
            id={`tab-${i}`}
            role="tab"
            aria-selected={i === on}
            tabIndex={i === on ? 0 : -1}
            ref={el => { refs.current[i] = el }}
            onClick={() => setOn(i)}
          >
            {n}
          </button>
        ))}
      </div>
      <p role="tabpanel" aria-labelledby={`tab-${on}`} className="panel">
        {text[on]}
      </p>
    </div>
  )
}
