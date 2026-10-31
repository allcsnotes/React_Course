import { useEffect, useState } from 'react'

export default function Courses() {
  const [courses, setCourses] = useState(null)

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(setCourses)
  }, [])

  return (
    <div>
      <h2>Courses</h2>
      {courses === null ? (
        <p className="note">Loading…</p>
      ) : (
        <ul>
          {courses.map(c => (
            <li key={c.id}>{c.title}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
