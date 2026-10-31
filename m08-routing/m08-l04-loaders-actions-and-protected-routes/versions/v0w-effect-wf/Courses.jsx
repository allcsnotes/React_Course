import { useEffect, useState } from 'react'

export default function Courses() {
  const [courses, setCourses] = useState(null)

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(setCourses)
  }, [])

  if (courses === null) return <p className="note">Loading…</p>

  return (
    <ul>
      {courses.map(c => (
        <li key={c.id}>{c.title}</li>
      ))}
    </ul>
  )
}
