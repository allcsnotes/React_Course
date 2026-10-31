import { useState, type ComponentType } from 'react'
import Ex01 from './exercises/Ex01.tsx'
import Ex02 from './exercises/Ex02.tsx'
import Ex03 from './exercises/Ex03.tsx'
import Ex04 from './exercises/Ex04.tsx'
import Ex05 from './exercises/Ex05.tsx'
import Ex06 from './exercises/Ex06.tsx'
import Ex07 from './exercises/Ex07.tsx'
import Ex08 from './exercises/Ex08.tsx'
import Ex09 from './exercises/Ex09.tsx'
import Ex10 from './exercises/Ex10.tsx'
import Ex11 from './exercises/Ex11.tsx'
import Ex12 from './exercises/Ex12.tsx'
import Ex13 from './exercises/Ex13.tsx'
import Ex14 from './exercises/Ex14.tsx'
import Ex15 from './exercises/Ex15.tsx'
import Ex16 from './exercises/Ex16.tsx'
import Ex17 from './exercises/Ex17.tsx'
import Ex18 from './exercises/Ex18.tsx'
import Ex19 from './exercises/Ex19.tsx'
import Ex20 from './exercises/Ex20.tsx'
import B07Default from './broken/B07Default.tsx'
import B13Mutation from './broken/B13Mutation.tsx'
import B16NoSelector from './broken/B16NoSelector.tsx'
import B16NewObject from './broken/B16NewObject.tsx'

type Entry = { n: number; title: string; Component: ComponentType }

const exercises: Entry[] = [
  { n: 1, title: 'Drill a user down three levels', Component: Ex01 },
  { n: 2, title: 'Fix the forgotten prop', Component: Ex02 },
  { n: 3, title: 'Predict the render counters', Component: Ex03 },
  { n: 4, title: 'Remove a floor with composition', Component: Ex04 },
  { n: 5, title: 'Theme context', Component: Ex05 },
  { n: 6, title: 'The closest provider wins', Component: Ex06 },
  { n: 7, title: 'A safe hook instead of a silent default', Component: Ex07 },
  { n: 8, title: 'User context: log in and enroll', Component: Ex08 },
  { n: 9, title: 'One big context or two small ones', Component: Ex09 },
  { n: 10, title: 'A counter with useReducer', Component: Ex10 },
  { n: 11, title: 'A pure cart reducer (node test)', Component: Ex11 },
  { n: 12, title: 'From useState to useReducer', Component: Ex12 },
  { n: 13, title: 'Pure under StrictMode', Component: Ex13 },
  { n: 14, title: 'assertNever: the forgotten case', Component: Ex14 },
  { n: 15, title: 'Cart store: context and reducer', Component: Ex15 },
  { n: 16, title: 'Zustand: store and selectors', Component: Ex16 },
  { n: 17, title: 'useShallow and persist', Component: Ex17 },
  { n: 18, title: 'Where does this state live?', Component: Ex18 },
  { n: 19, title: 'Cart totals and coupons', Component: Ex19 },
  { n: 20, title: 'Enrollment cart with a safe shelf', Component: Ex20 },
]

// Broken starters that run (the ones that fail type checking are in the broken/ folder).
const broken: Entry[] = [
  { n: 107, title: 'Broken 7 · silent default value', Component: B07Default },
  { n: 113, title: 'Broken 13 · reducer that pushes (StrictMode)', Component: B13Mutation },
  { n: 116, title: 'Broken 16 · no selector', Component: B16NoSelector },
  { n: 117, title: 'Broken 16 · selector builds a new object', Component: B16NewObject },
]

const all = [...exercises, ...broken]

function fromHash(): number | null {
  const m = /^#\/(\d+)$/.exec(window.location.hash)
  return m === null ? null : Number(m[1])
}

export default function App() {
  const [open, setOpen] = useState<number | null>(fromHash)
  const current = all.find((e) => e.n === open)

  function go(n: number | null) {
    window.location.hash = n === null ? '' : `/${n}`
    setOpen(n)
  }

  if (current) {
    const Exercise = current.Component
    return (
      <div>
        <button className="back" onClick={() => go(null)}>
          Back to menu
        </button>
        <h1>
          Exercise {current.n} · {current.title}
        </h1>
        <div id="exercise">
          <Exercise />
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1>Module 10 practice sheet · solutions</h1>
      <div className="menu">
        {exercises.map((e) => (
          <button key={e.n} onClick={() => go(e.n)}>
            {String(e.n).padStart(2, '0')} · {e.title}
          </button>
        ))}
      </div>
      <h2>Broken starters (they run)</h2>
      <div className="menu">
        {broken.map((e) => (
          <button key={e.n} onClick={() => go(e.n)}>
            {e.title}
          </button>
        ))}
      </div>
    </div>
  )
}
