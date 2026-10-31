import { Link } from 'react-router'
import type { Course } from '../types'
import formatPrice from '../utils/formatPrice'

export default function CourseCard({
  course,
}: {
  course: Course
}) {
  return (
    <article className="card">
      <h3>
        <Link to={`/courses/${course.slug}`}>
          {course.title}
        </Link>
      </h3>
      <div className="row">
        <span>{formatPrice(course.price)}</span>
      </div>
    </article>
  )
}
