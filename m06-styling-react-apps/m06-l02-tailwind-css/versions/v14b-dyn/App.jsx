import courses from './data/courses.js'
import CourseCard from './CourseCard.jsx'

export default function App() {
  return (
    <main
      className="grid min-h-screen grid-cols-2
        content-start gap-2 bg-slate-100 p-2"
    >
      {courses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </main>
  )
}
