import { useEffect, useRef, useState } from 'react'
import { COURSES, filterCourses, type SortDir } from '../lib/courses.ts'

function useDebounced<T>(value: T, ms: number): T {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return v
}

export default function T08() {
  const [text, setText] = useState('')
  const [dir, setDir] = useState<SortDir>('none')
  const debounced = useDebounced(text, 300)
  const runs = useRef(0)
  const first = useRef(true)
  const [, force] = useState(0)

  useEffect(() => {
    if (first.current) { first.current = false; return }
    runs.current += 1 // counts how many times the filter really changed
    force((n) => n + 1)
  }, [debounced])

  const rows = filterCourses(COURSES, debounced, dir)
  const next: SortDir = dir === 'none' ? 'asc' : dir === 'asc' ? 'desc' : 'none'

  return (
    <div>
      <input type="search" aria-label="Filter courses" placeholder="Filter courses" value={text} onChange={(e) => setText(e.target.value)} />
      <p data-testid="status">Showing {rows.length} of {COURSES.length} · filter applied {runs.current} times</p>
      {rows.length === 0 ? (
        <p>
          No courses match "{debounced.trim()}". <button onClick={() => setText('')}>Clear filter</button>
        </p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Level</th>
              <th aria-sort={dir === 'none' ? 'none' : dir === 'asc' ? 'ascending' : 'descending'}>
                <button onClick={() => setDir(next)}>Price {dir === 'asc' ? '▲' : dir === 'desc' ? '▼' : ''}</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id}><td>{c.title}</td><td>{c.level}</td><td>Rs {c.price}</td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
