import { useState } from 'react'
import { CoursePage } from './CoursePage'

const tabs = [
  { slug: 'react-for-beginners', label: 'React' },
  { slug: 'python-from-zero', label: 'Python' },
]

export default function App() {
  const [slug, setSlug] = useState('react-for-beginners')
  return (
    <main>
      <nav>
        {tabs.map((t) => (
          <button
            key={t.slug}
            className={t.slug === slug ? 'on' : ''}
            onClick={() => setSlug(t.slug)}
          >
            {t.label}
          </button>
        ))}
      </nav>
      <CoursePage slug={slug} />
    </main>
  )
}
