import { useRef, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import CourseRow from './CourseRow'
import SearchBar from './SearchBar'
import { COURSES } from './data'

export default function App() {
  const [query, setQuery] = useState('')
  const shown = COURSES.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()),
  )

  const parentRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: shown.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 5,
  })

  return (
    <div className="app">
      <SearchBar
        value={query}
        onChange={setQuery}
        count={shown.length}
      />
      <div className="list-free" ref={parentRef}>
        <ul
          className="virtual"
          style={{ height: virtualizer.getTotalSize() }}
        >
          {virtualizer.getVirtualItems().map((item) => (
            <CourseRow
              key={item.key}
              course={shown[item.index]}
              y={item.start}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}
