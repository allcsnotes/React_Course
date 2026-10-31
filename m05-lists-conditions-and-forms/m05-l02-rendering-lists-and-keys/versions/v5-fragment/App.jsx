import { Fragment } from 'react'
import courses from './data/courses.js'

export default function App() {
  return (
    <dl>
      {courses.map(course => (
        <Fragment key={course.id}>
          <dt>{course.title}</dt>
          <dd>by {course.teacher}</dd>
        </Fragment>
      ))}
    </dl>
  )
}
