import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { API } from './App'

type Detail = { title: string; teacher: string; level: string; summary: string; lessons: string[] }

export default function Course() {
  const { slug } = useParams()
  const [course, setCourse] = useState<Detail | null>(null)
  useEffect(() => {
    fetch(`${API}/api/courses/${slug}`).then((r) => r.json()).then(setCourse)
  }, [slug])
  if (!course) return <p className="muted">Loading…</p>
  return (
    <>
      <h1>{course.title}</h1>
      <p className="meta">
        by {course.teacher} · <span className="badge">{course.level}</span>
      </p>
      <p>{course.summary}</p>
      <h2>Lessons</h2>
      <ol>{course.lessons.map((l) => <li key={l}>{l}</li>)}</ol>
    </>
  )
}
