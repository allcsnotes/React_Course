import { useState } from 'react'
import Ex01 from './exercises/Ex01.jsx'
import Ex02 from './exercises/Ex02.jsx'
import Ex03 from './exercises/Ex03.jsx'
import Ex04 from './exercises/Ex04.jsx'
import Ex05 from './exercises/Ex05.jsx'
import Ex06 from './exercises/Ex06.jsx'
import Ex07 from './exercises/Ex07.jsx'
import Ex08 from './exercises/Ex08.jsx'
import Ex09 from './exercises/Ex09.jsx'
import Ex10 from './exercises/Ex10.jsx'
import Ex11 from './exercises/Ex11.jsx'
import Ex12 from './exercises/Ex12.jsx'
import Ex13 from './exercises/Ex13.jsx'
import Ex14 from './exercises/Ex14.jsx'
import Ex15 from './exercises/Ex15.jsx'
import Ex16 from './exercises/Ex16.jsx'
import Ex17 from './exercises/Ex17.jsx'
import Ex18 from './exercises/Ex18.jsx'
import Ex19 from './exercises/Ex19.jsx'
import Ex20 from './exercises/Ex20.jsx'
import Ex21 from './exercises/Ex21.jsx'
import Ex22 from './exercises/Ex22.jsx'
import Ex23 from './exercises/Ex23.jsx'
import Ex24 from './exercises/Ex24.jsx'
import Ex25 from './exercises/Ex25.jsx'

const exercises = [
  { n: 1, title: "Three small components", Component: Ex01 },
  { n: 2, title: "Fix the broken JSX", Component: Ex02 },
  { n: 3, title: "Expressions in curly braces", Component: Ex03 },
  { n: 4, title: "Course cards from props", Component: Ex04 },
  { n: 5, title: "Default props and a PriceTag", Component: Ex05 },
  { n: 6, title: "Children: a Panel wrapper", Component: Ex06 },
  { n: 7, title: "A Like button", Component: Ex07 },
  { n: 8, title: "Handlers with an argument", Component: Ex08 },
  { n: 9, title: "Seats left", Component: Ex09 },
  { n: 10, title: "Add 3: the updater function", Component: Ex10 },
  { n: 11, title: "Predict the snapshot", Component: Ex11 },
  { n: 12, title: "Object in state", Component: Ex12 },
  { n: 13, title: "Array in state: add and remove", Component: Ex13 },
  { n: 14, title: "Update one item in an array", Component: Ex14 },
  { n: 15, title: "Lift the state up", Component: Ex15 },
  { n: 16, title: "if, ternary and null", Component: Ex16 },
  { n: 17, title: "The && and the 0 trap", Component: Ex17 },
  { n: 18, title: "Lists, keys and filtering", Component: Ex18 },
  { n: 19, title: "Controlled text input", Component: Ex19 },
  { n: 20, title: "Checkbox, select and textarea", Component: Ex20 },
  { n: 21, title: "Form with validation", Component: Ex21 },
  { n: 22, title: "Derived values, not extra state", Component: Ex22 },
  { n: 23, title: "Mini cart", Component: Ex23 },
  { n: 24, title: "Filterable list with add-course form", Component: Ex24 },
  { n: 25, title: "Quiz", Component: Ex25 },
]

export default function App() {
  const [open, setOpen] = useState(null)
  const current = exercises.find((e) => e.n === open)

  if (current) {
    const Exercise = current.Component
    return (
      <div>
        <button className="back" onClick={() => setOpen(null)}>
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
      <h1>Module 5 practice sheet · solutions</h1>
      <div className="menu">
        {exercises.map((e) => (
          <button key={e.n} onClick={() => setOpen(e.n)}>
            {String(e.n).padStart(2, '0')} · {e.title}
          </button>
        ))}
      </div>
    </div>
  )
}
