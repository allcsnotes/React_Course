import courses from './data/courses.js'

function CourseRow(props) {
  return (
    <li className="row">
      <b>{props.course.title}</b>
      <small>key: {String(props.key)}</small>
    </li>
  )
}

export default function App() {
  return (
    <ul>
      {courses.map(course => (
        <CourseRow
          key={course.id}
          course={course}
        />
      ))}
    </ul>
  )
}
