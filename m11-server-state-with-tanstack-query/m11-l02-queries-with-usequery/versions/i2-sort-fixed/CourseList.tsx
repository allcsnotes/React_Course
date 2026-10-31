import { useState } from 'react'
import { useCourses } from './queries'
import CourseCards from './CourseCards'

export default function CourseList() {
  const { data, isPending, isError, error } = useCourses()
  const [cheap, setCheap] = useState(false)

  if (isPending) return <p className="note">Loading...</p>
  if (isError) return <p className="bad">{error.message}</p>

  const shown = cheap ? data.toSorted((a, b) => a.price - b.price) : data
  return (
    <>
      <label className="note">
        <input type="checkbox" checked={cheap} onChange={e => setCheap(e.target.checked)} /> Cheapest first
      </label>
      <CourseCards courses={shown} />
    </>
  )
}
