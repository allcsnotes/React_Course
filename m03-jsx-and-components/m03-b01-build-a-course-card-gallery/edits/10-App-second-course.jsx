import courses from './data/courses'
import CourseCard from './components/CourseCard'

function App() {
  return <CourseCard course={courses[1]} />
}

export default App
