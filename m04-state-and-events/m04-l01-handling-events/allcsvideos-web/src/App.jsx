import courses from './data/courses.js'
import CourseCard from './CourseCard.jsx'

function handleEnroll(title) {
  console.log('Enrolling in ' + title)
}

function App() {
  return (
    <div className="page">
      {courses.map(course => (
        <CourseCard
          key={course.id}
          course={course}
          onEnroll={handleEnroll}
        />
      ))}
    </div>
  )
}

export default App
