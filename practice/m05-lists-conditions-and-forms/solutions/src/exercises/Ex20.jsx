import { useState } from 'react'
import { courses } from '../courses'

export default function Ex20() {
  const [courseId, setCourseId] = useState('1')
  const [finished, setFinished] = useState(false)
  const [comment, setComment] = useState('')

  const course = courses.find((c) => String(c.id) === courseId)

  return (
    <div className="card">
      <h3>Write a review</h3>
      <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>
            {c.title}
          </option>
        ))}
      </select>
      <div>
        <label>
          <input type="checkbox" checked={finished} onChange={(e) => setFinished(e.target.checked)} /> I finished this course
        </label>
      </div>
      <textarea rows="3" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Your comment" />
      <h3>Preview</h3>
      <p>Course: {course.title}</p>
      <p>Status: {finished ? 'Finished' : 'Still learning'}</p>
      <p>Comment: {comment === '' ? '(none)' : comment}</p>
    </div>
  )
}
