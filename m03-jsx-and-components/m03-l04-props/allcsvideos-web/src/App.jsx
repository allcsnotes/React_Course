import Header from './components/Header.jsx'
import CourseCard from './components/CourseCard.jsx'
import Footer from './components/Footer.jsx'

function handleEnroll() {
  console.log('enrolled')
}

function App() {
  return (
    <main className="page">
      <Header />
      <CourseCard title="React for Beginners" lessons={12} onEnroll={handleEnroll} />
      <Footer />
    </main>
  )
}

export default App
