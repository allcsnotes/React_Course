import type { Course } from './data.ts'
import { useTheme } from './ThemeContext.tsx'
import { useUser } from './UserContext.tsx'

function EnrollButton() {
  const { user } = useUser()
  if (!user) {
    return (
      <button disabled>Log in to enroll</button>
    )
  }
  return <button>Enroll</button>
}

type Props = { course: Course }

export default function CourseCard({ course }: Props) {
  const { theme } = useTheme()
  return (
    <div className={`card card-${theme}`}>
      <div className="thumb" />
      <h2>{course.title}</h2>
      <p>
        by {course.teacher} · Rs {course.price}
      </p>
      <EnrollButton />
    </div>
  )
}
