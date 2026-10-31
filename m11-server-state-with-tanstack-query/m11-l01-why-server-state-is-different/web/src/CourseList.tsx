import { useCourses } from './useCourses'

export function CourseList() {
  const { data, status, error } = useCourses()
  if (status === 'pending') return <p className="note">Loading courses...</p>
  if (status === 'error') return <p className="bad">{error.message}</p>
  return (
    <ul className="grid">
      {data.map(c => (
        <li key={c.slug} className="card">
          <h2>{c.title}</h2>
          <p>{c.teacher} · Rs {c.price}</p>
        </li>
      ))}
    </ul>
  )
}
