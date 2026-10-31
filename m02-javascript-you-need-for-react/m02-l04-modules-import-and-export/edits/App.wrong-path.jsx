import './App.css'
import courses from './courses.js'
import { formatPrice } from './prices.js'

function App() {
  const course = courses[0]
  return (
    <main>
      <h1>Welcome to allcsvideos</h1>
      <div className="card">
        <h2>{course.title}</h2>
        <p>by {course.teacher}</p>
        <p>{formatPrice(course.price)}</p>
      </div>
    </main>
  )
}

export default App
