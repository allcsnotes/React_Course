import { useState } from 'react'
import courses from './data/courses.js'

function CourseRow({ course }) {
  const [saved, setSaved] = useState(false)
  return (
    <li className="row">
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
  const [onlyFree, setOnlyFree] = useState(false)
  const [byLessons, setByLessons] = useState(false)

  let shown = courses
  if (onlyFree) {
    shown = shown.filter(c => c.free)
  }
  if (byLessons) {
    shown = shown.toSorted(
      (a, b) => b.lessons - a.lessons
    )
  }

  return (
    <>
      <div className="top">
        <b>allcsvideos</b>
        <button onClick={() => setOnlyFree(!onlyFree)}>
          Free only
        </button>
        <button onClick={() => setByLessons(!byLessons)}>
          Most lessons first
        </button>
      </div>
      <ul>
        {shown.map((course, index) => (
          <CourseRow key={index} course={course} />
        ))}
      </ul>
    </>
  )
}
