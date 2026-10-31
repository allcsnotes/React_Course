import Header from './Header.jsx'
import CourseCard from './CourseCard.jsx'
import { courses } from './courses.js'

export default function App() {
  return (
    <div className="page">
      <Header />
      <main>
        {courses.map(c => (
          <CourseCard key={c.id} course={c} />
        ))}
      </main>
    </div>
  )
}
