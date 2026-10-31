import { useEffect, useState } from 'react'

export default function MyCourses() {
  const [courses, setCourses] = useState(null)

  useEffect(() => {
    fetch('/api/my-courses')
      .then(res => res.json())
      .then(setCourses)
  }, [])

  return (
    <div>
      <h2>My courses</h2>
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
