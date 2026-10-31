import { memo } from 'react'
import type { Course } from './api.ts'
import { countRender } from './perf.ts'

type Props = {
  course: Course
  enrolled: boolean
  onEnroll: () => void
}

export const CourseCard = memo(function CourseCard({
  course,
  enrolled,
  onEnroll,
}: Props) {
  countRender('CourseCard')
  return (
    <li className="card">
      <h2>{course.title}</h2>
      <p className="who">
        {course.instructor} · {course.students.toLocaleString('en-IN')}{' '}
        learners
      </p>
      <div className="meta">
        <span>{course.level}</span>
        <span>{course.hours} h</span>
        <span>★ {course.rating.toFixed(1)}</span>
      </div>
      <div className="foot">
        <strong>₹{course.price}</strong>
        <button
          className={enrolled ? 'done' : ''}
          onClick={onEnroll}
          disabled={enrolled}
        >
          {enrolled ? 'Enrolled' : 'Enroll'}
        </button>
      </div>
    </li>
  )
})
