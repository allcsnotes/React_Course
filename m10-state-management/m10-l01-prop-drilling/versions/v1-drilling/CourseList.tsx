import CourseCard from './CourseCard.tsx'
import { courses } from './courses.ts'
import type { Theme, User } from './types.ts'

type Props = { theme: Theme; user: User }

export default function CourseList({ theme, user }: Props) {
  return (
    <section className="grid">
      {courses.map(c => (
        <CourseCard key={c.slug} course={c} theme={theme} user={user} />
      ))}
    </section>
  )
}
