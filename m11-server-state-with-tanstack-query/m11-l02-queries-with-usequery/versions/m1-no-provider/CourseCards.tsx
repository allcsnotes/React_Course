import type { Course } from './schema'

export default function CourseCards({ courses }: { courses: Course[] }) {
  return (
    <ul className="grid">
      {courses.map(c => (
        <li key={c.slug} className="card">
          <h2>{c.title}</h2>
          <p>by {c.teacher} · Rs {c.price}</p>
        </li>
      ))}
    </ul>
  )
}
