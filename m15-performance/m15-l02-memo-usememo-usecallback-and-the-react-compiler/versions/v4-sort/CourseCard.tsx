import type { Course } from './data.ts'
import LikeButton from './LikeButton.tsx'
import { useRenderCount } from './useRenderCount.ts'

type Props = { course: Course; onOpen: (slug: string) => void }

export default function CourseCard({ course, onOpen }: Props) {
  const n = useRenderCount()
  return (
    <div className="card">
      <span className="cnt">card {n}</span>
      <h2 onClick={() => onOpen(course.slug)}>{course.title}</h2>
      <p>by {course.teacher} · Rs {course.price}</p>
      <LikeButton />
    </div>
  )
}
