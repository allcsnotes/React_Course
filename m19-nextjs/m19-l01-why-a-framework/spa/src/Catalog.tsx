import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { API, type CourseData } from './types.ts'

export default function Catalog() {
  const [courses, setCourses] = useState<CourseData[]>([])

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then(setCourses)
  }, [])

  return (
    <>
      <header className="top">
        <span className="logo">allcsvideos</span>
        <Link to="/">Courses</Link>
      </header>
      <main>
        <h1>Courses</h1>
        <ul className="grid">
          {courses.map((c) => (
            <li key={c.slug} className="card">
              <h2>
                <Link to={`/courses/${c.slug}`}>{c.title}</Link>
              </h2>
              <p>
                {c.teacher} · {c.level}
              </p>
              <p className="price">{c.free ? 'Free' : `₹${c.price}`}</p>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}
