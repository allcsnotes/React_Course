import courses from './data/courses.js'
import { formatPrice } from './price.js'
import './App.css'

export default function App() {
  const course = courses[1]
  return (
    <div className="card">
      <img src="{course.image}" alt={course.title} />
      <h2>{course.title}</h2>
      <span
        className={course.free ? 'tag free' : 'tag'}
      >
        {course.free ? 'Free' : 'Paid'}
      </span>
    </div>
  )
}
