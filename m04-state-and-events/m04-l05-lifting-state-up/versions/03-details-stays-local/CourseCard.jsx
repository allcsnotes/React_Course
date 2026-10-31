import { useState } from 'react'

function CourseCard({ course, enrolled, onEnroll }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="card">
      <h2>{course.title}</h2>
      <p>by {course.teacher}</p>
      {open && <p>{course.lessons} lessons</p>}
      <div className="row">
        <button disabled={enrolled} onClick={onEnroll}>
          {enrolled ? 'Enrolled' : 'Enroll'}
        </button>
        <button
          className="ghost"
          onClick={() => setOpen(!open)}
        >
          {open ? 'Hide' : 'Details'}
        </button>
      </div>
    </div>
  )
}

export default CourseCard
