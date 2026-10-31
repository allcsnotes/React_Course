import { Link } from 'react-router'
import { AddToCartButton } from '@/features/cart'
import formatPrice from '@/shared/lib/formatPrice'
import type { Course } from './types'

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
        <AddToCartButton item={course} />
      </div>
    </article>
  )
}
