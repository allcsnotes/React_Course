import { useState, type ReactNode } from 'react'
import { courses } from '../data.ts'

type Theme = 'light' | 'dark'
type User = { name: string }

// Page knows nothing about theme or user. It only has two slots and a footer.
function Page({ header, list }: { header: ReactNode; list: ReactNode }) {
  return (
    <main>
      {header}
      {list}
      <p className="muted">Footer: allcsvideos</p>
    </main>
  )
}

function Header({ theme, user }: { theme: Theme; user: User }) {
  return (
    <h3>
      allcsvideos · {user.name} · {theme}
    </h3>
  )
}

function CourseList({ theme }: { theme: Theme }) {
  return (
    <ul>
      {courses.slice(0, 2).map((c) => (
        <li key={c.id}>
          {c.title} ({theme})
        </li>
      ))}
    </ul>
  )
}

export default function Ex04() {
  const [theme, setTheme] = useState<Theme>('light')
  const user: User = { name: 'Lukas' }

  return (
    <div className="card">
      <Page header={<Header theme={theme} user={user} />} list={<CourseList theme={theme} />} />
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Switch theme</button>
    </div>
  )
}
