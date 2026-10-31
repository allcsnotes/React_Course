import './App.css'
import { courses } from './courses.js'

function CourseCard({ course }) {
  return (
    <div className="card">
      <h2>{course.title}</h2>
      <p>by {course.teacher}</p>
      <p>{course.lessons} lessons</p>
      <p className="price">{course.price === 0 ? 'Free' : 'Rs ' + course.price}</p>
    </div>
  )
}

export default function App() {
  return (
    <main>
      <h1>All courses</h1>
      <div className="grid">
        {courses.filter(c => c.free).map(c => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
    </main>
  )
}
