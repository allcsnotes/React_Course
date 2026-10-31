import { useState } from 'react'

function CourseCard({ course }) {
  const [enrolled, setEnrolled] = useState(false)

  return (
    <div className="card">
      <h2>{course.title}</h2>
      <p>by {course.teacher}</p>
      <button
        disabled={enrolled}
        onClick={() => setEnrolled(true)}
      >
        {enrolled ? 'Enrolled' : 'Enroll'}
      </button>
    </div>
  )
}

export default CourseCard
