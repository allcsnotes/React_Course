import { useCallback, useDeferredValue, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchCourses } from './api.ts'
import { CourseGrid } from './CourseGrid.tsx'
import { Insights } from './Insights.tsx'
import { timed } from './perf.ts'

export function Catalog() {
  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  })
  const [query, setQuery] = useState('')
  const [enrolled, setEnrolled] = useState<Set<number>>(new Set())
  const [showInsights, setShowInsights] = useState(false)
  const deferredQuery = useDeferredValue(query)

  const shown = useMemo(
    () =>
      timed('filter+sort', () =>
        courses
          .filter((c) =>
            c.title.toLowerCase().includes(deferredQuery.toLowerCase()),
          )
          .sort((a, b) => a.title.localeCompare(b.title)),
      ),
    [courses, deferredQuery],
  )

  const enroll = useCallback((id: number) => {
    setEnrolled((prev) => new Set(prev).add(id))
  }, [])

  return (
    <div className="page">
      <header className="top">
        <h1>Course catalog</h1>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses"
        />
        <span className="count">
          {shown.length.toLocaleString()} courses
        </span>
        <button
          className="ghost"
          onClick={() => setShowInsights((s) => !s)}
        >
          Insights
        </button>
      </header>
      {showInsights && <Insights courses={courses} />}
      <CourseGrid
        courses={shown}
        enrolled={enrolled}
        onEnroll={enroll}
        dimmed={query !== deferredQuery}
      />
    </div>
  )
}
