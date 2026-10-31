import { useState } from 'react'
import courses from './data/courses.js'

function App() {
  const [courseId, setCourseId] = useState(1)
  const course = courses.find(c => c.id === courseId)

  return (
    <div className="page">
      <label htmlFor="course">Pick a course</label>
      <select
        id="course"
        value={courseId}
        onChange={e =>
          setCourseId(e.target.value)
        }
      >
        {courses.map(c => (
          <option key={c.id} value={c.id}>
            {c.title}
          </option>
        ))}
      </select>
      <p className="out">{course.teacher}</p>
      <p className="dim">
        {course.lessons} lessons · Rs {course.price}
      </p>
    </div>
  )
}

export default App
