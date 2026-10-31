import type { Course } from './data.ts'
import type { Theme, User } from './App.tsx'

type Props = {
  course: Course
  theme: Theme
  user: User | null
}
type UserProp = { user: User | null }

function EnrollButton({ user }: UserProp) {
  if (!user) {
    return (
      <button disabled>Log in to enroll</button>
    )
  }
  return <button>Enroll</button>
}

export default function CourseCard(p: Props) {
  const c = p.course
  return (
    <div className={`card card-${p.theme}`}>
      <div className="thumb" />
      <h2>{c.title}</h2>
      <p>
        by {c.teacher} · Rs {c.price}
      </p>
      <EnrollButton user={p.user} />
    </div>
  )
}
