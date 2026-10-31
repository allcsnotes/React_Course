import { courses } from './data.ts'
import CourseCard from './CourseCard.tsx'
import type { Theme, User } from './App.tsx'

type Props = { theme: Theme; user: User | null }

export default function CourseList(p: Props) {
  return (
    <div className="main">
      <h1>Courses</h1>
      <div className="grid">
        {courses.map((c) => (
          <CourseCard
            key={c.slug}
            course={c}
            theme={p.theme}
            user={p.user}
          />
        ))}
      </div>
    </div>
  )
}
