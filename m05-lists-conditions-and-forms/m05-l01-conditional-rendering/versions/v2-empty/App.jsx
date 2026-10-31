import { useState } from 'react'
import './App.css'
import allCourses from './data/courses.js'

function CourseList({ courses }) {
  if (courses.length === 0) {
    return <p className="msg">No courses yet</p>
  }
  return (
    <ul>
      {courses.map(c => (
        <li key={c.id}>{c.title}</li>
      ))}
    </ul>
  )
}

export default function App() {
  const [courses, setCourses] = useState(allCourses)

  return (
    <div className="card">
      <h2>My courses</h2>
      <CourseList courses={courses} />
      <button onClick={() => setCourses([])}>
        Clear list
      </button>
    </div>
  )
}
