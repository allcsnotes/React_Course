import { useState, type ComponentType } from 'react'
import T01 from './tasks/T01.tsx'
import T02 from './tasks/T02.tsx'
import T03 from './tasks/T03.tsx'
import T04 from './tasks/T04.tsx'
import T05 from './tasks/T05.tsx'
import T06 from './tasks/T06.tsx'
import T07 from './tasks/T07.tsx'
import T08 from './tasks/T08.tsx'
import T09 from './tasks/T09.tsx'
import T10 from './tasks/T10.tsx'

type Entry = { n: number; title: string; Component: ComponentType }

const tasks: Entry[] = [
  { n: 1, title: 'Search box with suggestions', Component: T01 },
  { n: 2, title: 'Endless list', Component: T02 },
  { n: 3, title: 'Star rating', Component: T03 },
  { n: 4, title: 'Nested comments', Component: T04 },
  { n: 5, title: 'Tabs', Component: T05 },
  { n: 6, title: 'Toast stack', Component: T06 },
  { n: 7, title: 'Modal with a focus trap', Component: T07 },
  { n: 8, title: 'Debounced filter table', Component: T08 },
  { n: 9, title: 'Reorder list with buttons', Component: T09 },
  { n: 10, title: 'Multi-step form', Component: T10 },
]

function fromHash(): number | null {
  const m = /^#\/(\d+)$/.exec(window.location.hash)
  return m === null ? null : Number(m[1])
}

export default function App() {
  const [open, setOpen] = useState<number | null>(fromHash)
  const current = tasks.find((t) => t.n === open)

  function go(n: number | null) {
    window.location.hash = n === null ? '' : `/${n}`
    setOpen(n)
  }

  if (current) {
    const Task = current.Component
    return (
      <div>
        <button className="back" onClick={() => go(null)}>Back to menu</button>
        <h1>Task {current.n} · {current.title}</h1>
        <div id="exercise"><Task /></div>
      </div>
    )
  }

  return (
    <div>
      <h1>Module 23 final practice sheet · machine-coding solutions</h1>
      <div className="menu">
        {tasks.map((t) => (
          <button key={t.n} onClick={() => go(t.n)}>{String(t.n).padStart(2, '0')} · {t.title}</button>
        ))}
      </div>
    </div>
  )
}
