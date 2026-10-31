import { useState } from 'react'

export default function App() {
  const [courses, setCourses] = useState(['React for Beginners', 'Python from Zero', 'DevOps Basics'])
  return (
    <main>
      <h1>Course shelf</h1>
      <input placeholder="note" />
      <button onClick={() => setCourses([...courses, 'Git Basics'])}>Add course</button>
      <ul>{courses.map(c => <li key={c}>{c}</li>)}</ul>
    </main>
  )
}
