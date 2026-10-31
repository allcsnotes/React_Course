import CourseCard from './components/CourseCard'
import Banner from './components/Banner'
import courses from './data/courses'

export default function App() {
  return (
    <>
      <Banner />
      <CourseCard course={courses[0]} />
    </>
  )
}
