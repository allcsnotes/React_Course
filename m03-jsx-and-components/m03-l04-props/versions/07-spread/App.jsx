import Header from './components/Header.jsx'
import CourseCard from './components/CourseCard.jsx'
import Footer from './components/Footer.jsx'
import courses from './data/courses.js'

function App() {
  return (
    <main className="page">
      <Header />
      {courses.map(course => (
        <CourseCard key={course.id} {...course} />
      ))}
      <Footer />
    </main>
  )
}

export default App
