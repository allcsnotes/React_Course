import courses from './data/courses.js'
import { formatPrice } from './price.js'
import './App.css'

export default function App() {
  const course = courses[0]
  return (
    <div className="card">
      <h2>{course.title}</h2>
      <p>{if (course.free) 'Free' else 'Paid'}</p>
    </div>
  )
}
