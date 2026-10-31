import EnrollButton from './EnrollButton.tsx'
import type { Course, Lang, Theme, User } from './types.ts'

type Props = { course: Course; theme: Theme; user: User; lang: Lang }

export default function CourseCard({ course, theme, user, lang }: Props) {
  const price = course.price === 0 ? 'Free' : `Rs ${course.price}`
  return (
    <article className="card">
      <h2>{course.title}</h2>
      <p>{course.teacher} · {price}</p>
      <EnrollButton theme={theme} user={user} lang={lang} />
    </article>
  )
}
