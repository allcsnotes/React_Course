import { useCourses } from './CoursesProvider'

export function CourseList() {
  const courses = useCourses()
  if (courses.length === 0) return <p className="note">Loading courses...</p>
  return (
    <ul className="grid">
      {courses.map(c => (
        <li key={c.slug} className="card">
          <h2>{c.title}</h2>
          <p>{c.teacher} · Rs {c.price}</p>
        </li>
      ))}
    </ul>
  )
}
