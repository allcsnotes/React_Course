import { useState } from 'react'

export default function App() {
  const [course, setCourse] = useState({
    title: 'React for Beginners',
    lessons: 12,
  })

  function addLesson() {
    setCourse({
      ...course,
      lessons: course.lessons + 1,
    })
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
