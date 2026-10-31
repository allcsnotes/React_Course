import { useState } from 'react'
import { courses } from '../courses'

function CourseList({ selectedId, onSelect }) {
  return (
    <div className="card">
      {courses.map((c) => (
        <button key={c.id} className={c.id === selectedId ? 'on' : ''} onClick={() => onSelect(c.id)}>
          {c.title}
        </button>
      ))}
    </div>
  )
}

function CourseDetail({ selectedId }) {
  const course = courses.find((c) => c.id === selectedId)
  if (!course) return <div className="card">Pick a course on the left</div>
  return (
    <div className="card">
      <h3>{course.title}</h3>
      <p>
        {course.teacher} · {course.lessons} lessons · {course.price === 0 ? 'Free' : 'Rs ' + course.price}
      </p>
    </div>
  )
}

export default function Ex15() {
  const [selectedId, setSelectedId] = useState(null)

  return (
    <div>
      <CourseList selectedId={selectedId} onSelect={setSelectedId} />
      <CourseDetail selectedId={selectedId} />
    </div>
  )
}
