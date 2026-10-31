import { useState } from 'react'

export default function App() {
  const [course, setCourse] = useState({
    title: 'React for Beginners',
    lessons: 12,
  })

  function addLesson() {
    course.lessons++
    console.log(course.lessons)
    setCourse(course)
  }

  return (
    <div className="page one">
      <div className="card">
        <h2>{course.title}</h2>
        <p className="body">{course.lessons} lessons</p>
        <button onClick={addLesson}>Add a lesson</button>
      </div>
    </div>
  )
}
