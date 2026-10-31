import Banner from './components/Banner'
import CourseCard from './components/CourseCard'
import courses from './data/courses'

export default function App() {
  return (
    <>
      <Banner />
      <CourseCard course={courses[0]} />
    </>
  )
}
