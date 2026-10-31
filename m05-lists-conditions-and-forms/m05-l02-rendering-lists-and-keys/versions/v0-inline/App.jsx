import courses from './data/courses.js'

export default function App() {
  return (
    <ul>
      {courses.map(course => (
        <li key={course.id} className="row">
          <img src={course.image} alt="" />
          <b>{course.title}</b>
          <input placeholder="notes" />
        </li>
      ))}
    </ul>
  )
}
