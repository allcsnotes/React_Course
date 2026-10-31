import './App.css'
import courses from './courses.js'
import { formatPrise } from './price.js'

function App() {
  const course = courses[0]
  return (
    <main>
      <h1>Welcome to allcsvideos</h1>
      <div className="card">
        <h2>{course.title}</h2>
        <p>by {course.teacher}</p>
        <p>{formatPrise(course.price)}</p>
      </div>
    </main>
  )
}

export default App
