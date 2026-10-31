'use client'
import { useEffect, useState } from 'react'

type Course = { slug: string; title: string; teacher: string; level: string }

export default function PlainCatalog() {
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    fetch('http://localhost:8222/api/courses')
      .then((res) => res.json())
      .then((data) => setCourses(data.courses))
  }, [])

  return (
    <ul>
      {courses.map((c) => (
        <li key={c.slug} className="card">
          <span>
            {c.title}
            <small>{c.teacher} · {c.level}</small>
          </span>
          <button onClick={() => setCourses(courses.filter((x) => x.slug !== c.slug))}>Hide</button>
        </li>
      ))}
    </ul>
  )
}
