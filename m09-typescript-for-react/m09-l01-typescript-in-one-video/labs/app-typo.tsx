import type { Course } from './types.ts'

const course: Course = {
  id: 1,
  title: 'React for Beginners',
  teacher: 'Meera',
  price: 499,
}

function App() {
  return (
    <main className="page">
      <header className="header">
        <h1>allcsvideos</h1>
      </header>
      <div className="card">
        <h2>{course.title}</h2>
        <p>by {course.teacher}</p>
        <p className="price">Rs {course.prise}</p>
      </div>
    </main>
  )
}

export default App
