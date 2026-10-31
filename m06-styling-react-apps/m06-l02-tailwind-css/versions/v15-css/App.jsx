import courses from './data/courses.js'
import CourseCard from './CourseCard.jsx'

export default function App() {
  return (
    <main className="page">
      <CourseCard course={courses[0]} />
    </main>
  )
}
