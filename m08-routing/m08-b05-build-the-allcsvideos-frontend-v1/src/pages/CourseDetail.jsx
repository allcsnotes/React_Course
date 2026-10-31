import { Link, useOutletContext } from 'react-router'
import formatPrice from '../utils/formatPrice.js'

export default function CourseDetail() {
  const { course, enrolled, toggleEnroll } = useOutletContext()
  const isIn = enrolled.includes(course.slug)

  return (
    <>
      <h1>{course.title}</h1>
      <p>
        by {course.teacher} · {course.level} ·{' '}
        {course.lessons.length} lessons
      </p>
      <p>{formatPrice(course.price)}</p>
      <button onClick={() => toggleEnroll(course.slug)}>
        {isIn ? 'Enrolled' : 'Enroll'}
      </button>{' '}
      <Link to={`/courses/${course.slug}/lessons/1`}>
        Start lesson 1
      </Link>
    </>
  )
}
