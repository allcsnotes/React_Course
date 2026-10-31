import { Profiler, useState } from 'react'
import { courses } from './data.ts'
import CourseCard from './CourseCard.tsx'
import { report } from './report.ts'

export default function App() {
  const [query, setQuery] = useState('')
  const shown = courses.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()),
  )
  return (
    <>
      <Profiler id="header" onRender={report}>
        <header>
          <strong>allcsvideos</strong>
          <input
            placeholder="Search 8,000 courses"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </header>
      </Profiler>
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
