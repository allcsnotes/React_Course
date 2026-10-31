import { useTheme } from './ThemeContext.tsx'
import { useUser } from './UserContext.tsx'
import type { Course } from './data.ts'
import { useRenderCount } from './useRenderCount.ts'

function EnrollButton() {
  const n = useRenderCount()
  const { user } = useUser()
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
  const { theme } = useTheme()
  return (
    <div className={`card card-${theme}`}>
      <span className="cnt">card {n}</span>
      <h2>{course.title}</h2>
      <p>by {course.teacher} · Rs {course.price}</p>
      <EnrollButton />
    </div>
  )
}
