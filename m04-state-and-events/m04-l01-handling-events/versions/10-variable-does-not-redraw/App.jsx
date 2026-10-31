import courses from './data/courses.js'
import CourseCard from './CourseCard.jsx'

function App() {
  return (
    <div className="page">
      <CourseCard course={courses[0]} />
      <CourseCard course={courses[1]} />
    </div>
  )
}

export default App
