import { useEffect, useState } from 'react'
import { API } from './api'

type Course = { title: string; teacher: string }

export function CoursePage({ slug }: { slug: string }) {
  const [course, setCourse] = useState<Course | null>(null)

  useEffect(() => {
    fetch(`${API}/api/courses/${slug}`)
      .then((res) => res.json())
      .then(setCourse)
  }, [slug])

  if (!course) return <p className="meta">Loading...</p>
  return (
    <>
      <h1>{course.title}</h1>
      <p className="meta">Taught by {course.teacher}</p>
    </>
  )
}
