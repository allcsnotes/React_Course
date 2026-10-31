import { useFetch } from './useFetch'
import { TeacherLine } from './TeacherLine'
import type { Course } from './types'

export function CourseList() {
  const { data, status, error } = useFetch<Course[]>('/api/courses')
  if (status === 'loading') return <p className="note">Loading courses...</p>
  if (status === 'error') return <p className="bad">{error}</p>
  return (
    <ul className="grid">
      {data!.map(c => (
        <li key={c.slug} className="card">
          <h2>{c.title}</h2>
          <p><TeacherLine name={c.teacher} /> · Rs {c.price}</p>
        </li>
      ))}
    </ul>
  )
}
