import CourseCard from './components/CourseCard'
import Progress from './components/Progress'
import courses from './data/courses'

export default function App() {
  return (
    <>
      <CourseCard course={courses[0]} />
      <Progress total={12} />
    </>
  )
}
