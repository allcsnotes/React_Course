import { useState } from 'react'
import CourseDetail from './CourseDetail'

const TABS = [
  ['react-for-beginners', 'React'],
  ['python-from-zero', 'Python'],
  ['system-design', 'Design'],
]

export default function App() {
  const [slug, setSlug] = useState(TABS[0][0])

  return (
    <main>
      <nav>
        {TABS.map(([s, name]) => (
          <button key={s} className={s === slug ? 'on' : ''} onClick={() => setSlug(s)}>
            {name}
          </button>
        ))}
      </nav>
      <CourseDetail slug={slug} />
    </main>
  )
}
