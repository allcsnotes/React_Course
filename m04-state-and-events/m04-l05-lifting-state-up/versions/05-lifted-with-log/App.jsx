import { useState } from 'react'
import Header from './Header.jsx'
import CourseCard from './CourseCard.jsx'
import { courses } from './courses.js'

export default function App() {
  const [enrolledIds, setEnrolledIds] = useState([])

  console.log('enrolledIds', enrolledIds)

  function handleEnroll(id) {
    setEnrolledIds([...enrolledIds, id])
  }

  return (
    <div className="page">
      <Header count={enrolledIds.length} />
      <main>
        {courses.map(c => (
          <CourseCard
            key={c.id}
            course={c}
            enrolled={enrolledIds.includes(c.id)}
            onEnroll={() => handleEnroll(c.id)}
          />
        ))}
      </main>
    </div>
  )
}
