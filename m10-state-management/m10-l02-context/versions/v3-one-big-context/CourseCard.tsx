import { useApp } from './AppContext.tsx'
import type { Course } from './data.ts'
import { useRenderCount } from './useRenderCount.ts'

function EnrollButton() {
  const n = useRenderCount()
  const { user } = useApp()
  return (
    <>
      <button disabled={!user}>
        {user ? 'Enroll' : 'Log in to enroll'}
      </button>
      <span className="cnt">enroll {n}</span>
    </>
  )
}

type Props = { course: Course }

export default function CourseCard({ course }: Props) {
  const n = useRenderCount()
  const { theme } = useApp()
  return (
    <div className={`card card-${theme}`}>
      <span className="cnt">card {n}</span>
      <h2>{course.title}</h2>
      <p>by {course.teacher} · Rs {course.price}</p>
      <EnrollButton />
    </div>
  )
}
