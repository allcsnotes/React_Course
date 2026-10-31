import { useState } from 'react'
import courses from './data/courses.js'

function CourseRow({ course }) {
  const [saved, setSaved] = useState(false)
  return (
    <li key={course.id} className="row">
      <img src={course.image} alt="" />
      <b>{course.title}</b>
      <input placeholder="notes" />
      <button onClick={() => setSaved(!saved)}>
        {saved ? 'Saved' : 'Save'}
      </button>
    </li>
  )
}

export default function App() {
  return (
    <ul>
      {courses.map(course => (
        <CourseRow course={course} />
      ))}
    </ul>
  )
}
