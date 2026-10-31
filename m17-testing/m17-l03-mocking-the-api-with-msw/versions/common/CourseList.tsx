import { useCourses } from './useCourses.ts'

export function CourseList() {
  const { status, courses } = useCourses()

  if (status === 'loading') return <p>Loading courses...</p>
  if (status === 'error') return <p className="err">Could not load courses.</p>

  return (
    <main>
      <h1>Courses</h1>
      <ul>
        {courses.map((c) => (
          <li key={c.slug}>
            <b>{c.title}</b>
            <div className="meta">{c.teacher} · {c.lessonCount} lessons</div>
          </li>
        ))}
      </ul>
    </main>
  )
}
