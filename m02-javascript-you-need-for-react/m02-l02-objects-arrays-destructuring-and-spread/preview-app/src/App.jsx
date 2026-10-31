import { useState } from 'react'
import './App.css'

function Card({ title, teacher, lessons }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>by {teacher} · {lessons} lessons</p>
    </div>
  )
}

export default function App() {
  const [course, setCourse] = useState({
    title: 'React for Beginners',
    teacher: 'Meera',
    lessons: 12,
  })
  const [count, setCount] = useState(0)
  return (
    <main>
      <Card title={course.title} teacher={course.teacher} lessons={course.lessons} />
      <button onClick={() => setCourse({ ...course, lessons: 13 })}>Add a lesson</button>
      <button onClick={() => setCount(count + 1)}>Likes: {count}</button>
    </main>
  )
}
