import { courses } from './courses.js'
import CourseCard from './CourseCard.jsx'

export default function App() {
  return (
    <div className="page">
      <CourseCard course={courses[0]} />
    </div>
  )
}
