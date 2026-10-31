import type { Course } from './types'

interface CourseCardProps {
  course: Course
  level: 'beginner' | 'advanced'
  badge?: string
  onEnroll: (id: number) => void
}

export default function CourseCard({
  course,
  level,
  badge,
  onEnroll,
}: CourseCardProps) {
  return (
    <div className="card">
      <h3>{course.title}</h3>
      {badge && <span className="badge">{badge}</span>}
      <p>{course.lessons} lessons, Rs {course.price}</p>
      <span className="level">{level}</span>
      <button onClick={() => onEnroll(course.id)}>
        Enroll
      </button>
    </div>
  )
}
