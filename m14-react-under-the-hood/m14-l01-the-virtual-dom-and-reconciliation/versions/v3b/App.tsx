import { useState } from 'react'

const start = [
  { id: 1, title: 'React', teacher: 'Meera' },
  { id: 2, title: 'Python', teacher: 'Meera' },
  { id: 3, title: 'DevOps', teacher: 'Asha' },
  { id: 4, title: 'SQL', teacher: 'Asha' },
]

export default function App() {
  const [list, setList] = useState(start)
  const add = () => {
    const git = { id: 5, title: 'Git', teacher: 'Meera' }
    setList([git, ...list])
  }
  return (
    <main>
      <button onClick={add}>Add Git at the top</button>
      <ul>
        {list.map(c => (
          <li key={c.id}>
            <h3>{c.title}</h3>
            <p>{c.teacher}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
