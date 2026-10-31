import courses from './data/courses.js'
import { formatPrice } from './price.js'
import './App.css'

export default function App() {
  const course = courses[0]
  return (
    <div className="card">
      <p>{course}</p>
    </div>
  )
}
