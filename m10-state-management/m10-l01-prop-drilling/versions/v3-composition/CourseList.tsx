import CourseCard from './CourseCard.tsx'
import { courses } from './courses.ts'
import type { Lang, Theme, User } from './types.ts'

type Props = { theme: Theme; user: User; lang: Lang }

export default function CourseList({ theme, user, lang }: Props) {
  return (
    <section className="grid">
      {courses.map(c => (
        <CourseCard key={c.slug} course={c} theme={theme} user={user} lang={lang} />
      ))}
    </section>
  )
}
