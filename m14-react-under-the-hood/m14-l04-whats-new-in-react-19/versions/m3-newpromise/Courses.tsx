import { Suspense, use } from 'react'
import { getCourses, type Course } from './api'

function CourseList() {
  const courses = use(getCourses())
  return (
    <ul className="grid">
      {courses.map((c: Course) => (
        <li className="card" key={c.slug}>
          <h2>{c.title}</h2>
          <p>by {c.teacher} · {c.price ? `Rs ${c.price}` : 'Free'}</p>
        </li>
      ))}
    </ul>
  )
}

export function Courses() {
  return (
    <Suspense fallback={<p className="note">Loading courses…</p>}>
      <CourseList />
    </Suspense>
  )
}
