import CourseCard from './components/CourseCard'
import courses from './data/courses'

export default function App() {
  return <CourseCard course={courses[0]} />
}
