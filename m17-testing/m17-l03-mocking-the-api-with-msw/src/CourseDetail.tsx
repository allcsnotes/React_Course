import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { API } from './api.ts'

type Detail = { title: string; lessons: { id: number; title: string }[] }

export function CourseDetail() {
  const { slug } = useParams()
  const [course, setCourse] = useState<Detail | null | 'missing'>(null)

  useEffect(() => {
    fetch(`${API}/api/courses/${slug}`).then((res) =>
      res.ok ? res.json().then(setCourse) : setCourse('missing'),
    )
  }, [slug])

  if (course === null) return <p>Loading course...</p>
  if (course === 'missing') return <p className="err">No course with that name.</p>

  return (
    <main>
      <h1>{course.title}</h1>
      <ul>
        {course.lessons.map((l) => (
          <li key={l.id}>{l.title}</li>
        ))}
      </ul>
      <Link to="/">Back to all courses</Link>
    </main>
  )
}
