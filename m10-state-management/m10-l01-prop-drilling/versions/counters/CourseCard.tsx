import EnrollButton from './EnrollButton.tsx'
import Renders from './Renders.tsx'
import type { Course, Theme, User } from './types.ts'

type Props = { course: Course; theme: Theme; user: User }

export default function CourseCard({ course, theme, user }: Props) {
  const price = course.price === 0 ? 'Free' : `Rs ${course.price}`
  return (
    <article className="card">
      <Renders name="CourseCard" />
      <h2>{course.title}</h2>
      <p>{course.teacher} · {price}</p>
      <EnrollButton theme={theme} user={user} />
    </article>
  )
}
