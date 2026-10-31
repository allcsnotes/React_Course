import { Link } from 'react-router'
import type { Course } from '../types'
import formatPrice from '../utils/formatPrice'
import AddToCartButton from './AddToCartButton'

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
        <span>{formatPrice(String(course.price))}</span>
        <AddToCartButton course={course} />
      </div>
    </article>
  )
}
