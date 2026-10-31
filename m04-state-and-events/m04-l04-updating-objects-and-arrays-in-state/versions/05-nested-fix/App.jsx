import { useState } from 'react'

export default function App() {
  const [course, setCourse] = useState({
    title: 'React for Beginners',
    lessons: 12,
    teacher: { name: 'Meera' },
  })

  function changeTeacher() {
    const next = {
      ...course,
      teacher: {
        ...course.teacher,
        name: 'Asha',
      },
    }
    console.log(course.teacher.name)
    setCourse(next)
  }

  return (
    <div className="page one">
      <div className="card">
        <h2>{course.title}</h2>
        <p className="body">{course.lessons} lessons</p>
        <p className="body small">by {course.teacher.name}</p>
        <button onClick={changeTeacher}>Change teacher</button>
      </div>
    </div>
  )
}
