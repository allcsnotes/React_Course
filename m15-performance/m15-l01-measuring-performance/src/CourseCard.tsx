import type { Course } from './data.ts'

type Props = { course: Course }

export default function CourseCard({ course }: Props) {
  const price = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(course.price)
  return (
    <div className="card">
      <h2>{course.title}</h2>
      <p>
        by {course.teacher} · {price}
      </p>
    </div>
  )
}
