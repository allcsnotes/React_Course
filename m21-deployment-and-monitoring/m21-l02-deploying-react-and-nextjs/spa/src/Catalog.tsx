import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { API } from './App'

type Course = { slug: string; title: string; teacher: string; level: string; price: number; summary: string }

export default function Catalog() {
  const [courses, setCourses] = useState<Course[]>([])
  useEffect(() => {
    fetch(`${API}/api/courses`).then((r) => r.json()).then(setCourses)
  }, [])
  return (
    <>
      <h1>All courses</h1>
      <div className="grid">
        {courses.map((c) => (
          <Link key={c.slug} to={`/courses/${c.slug}`} className="card">
            <div className="cover" />
            <div className="card-body">
              <h3>{c.title}</h3>
              <p>{c.teacher}</p>
              <span className="price">{c.price === 0 ? 'Free' : `₹${c.price}`}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
