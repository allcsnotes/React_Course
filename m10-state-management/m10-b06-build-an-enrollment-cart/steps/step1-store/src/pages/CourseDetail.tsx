import { useLoaderData } from 'react-router'
import type { Course } from '../types'
import formatPrice from '../utils/formatPrice'

export default function CourseDetail() {
  const course = useLoaderData<Course>()

  return (
    <>
      <h1>{course.title}</h1>
      <p>
        by {course.teacher} · {course.level} ·{' '}
        {course.lessonCount} lessons
      </p>
      <p>{formatPrice(course.price)}</p>
    </>
  )
}
