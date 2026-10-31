import { Profiler, useEffect, useState } from 'react'
import { courses } from './data.ts'
import CourseCard from './CourseCard.tsx'
import { report } from './report.ts'

export default function App() {
  const [query, setQuery] = useState('')
  const [sale, setSale] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setSale(true), 700)
    return () => clearTimeout(id)
  }, [])
  const shown = courses.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()),
  )
  return (
    <>
      <div className="banner">
        {sale ? 'Summer sale: 30% off every course' : ''}
      </div>
      <header>
        <strong>allcsvideos</strong>
        <input
          placeholder="Search 8,000 courses"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </header>
      <p className="count">{shown.length} courses</p>
      <Profiler id="catalog" onRender={report}>
        <div className="grid">
          {shown.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </Profiler>
    </>
  )
}
