import type { Course } from './data'

export default function CourseRow({ course, y }: { course: Course; y?: number }) {
  return (
    <li className="row" style={y === undefined ? undefined : { transform: `translateY(${y}px)` }}>
      <span className="num">#{course.id}</span>
      <span className="title">{course.title}</span>
      <span className="tag">{course.topic}</span>
      <span className="hrs">{course.hours} h</span>
    </li>
  )
}
