import { useState } from 'react'
import CourseRow from './CourseRow'
import SearchBar from './SearchBar'
import { COURSES } from './data'

export default function App() {
  const [query, setQuery] = useState('')
  const shown = COURSES.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="app">
      <SearchBar
        value={query}
        onChange={setQuery}
        count={shown.length}
      />
      <ul className="list">
        {shown.map((c) => (
          <CourseRow key={c.id} course={c} />
        ))}
      </ul>
    </div>
  )
}
