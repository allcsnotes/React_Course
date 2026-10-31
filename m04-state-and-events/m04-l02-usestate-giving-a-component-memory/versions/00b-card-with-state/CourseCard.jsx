import { useState } from 'react'

function CourseCard({ course }) {
  const [enrolled, setEnrolled] = useState(false)

  function handleEnroll() {
    setEnrolled(true)
  }

  return (
    <div className="card">
      <h2>{course.title}</h2>
      <button onClick={handleEnroll}>
        {enrolled ? 'Enrolled' : 'Enroll'}
      </button>
    </div>
  )
}

export default CourseCard
