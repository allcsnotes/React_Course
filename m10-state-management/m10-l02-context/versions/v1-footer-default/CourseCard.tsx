import { useContext } from 'react'
import type { Course } from './data.ts'
import { ThemeContext } from './ThemeContext.tsx'
import { UserContext } from './UserContext.tsx'

function EnrollButton() {
  const { user } = useContext(UserContext)
  if (!user) {
    return (
      <button disabled>Log in to enroll</button>
    )
  }
  return <button>Enroll</button>
}

type Props = { course: Course }

export default function CourseCard({ course }: Props) {
  const { theme } = useContext(ThemeContext)
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
