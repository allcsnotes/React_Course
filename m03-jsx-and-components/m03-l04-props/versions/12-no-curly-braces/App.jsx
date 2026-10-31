import Header from './components/Header.jsx'
import CourseCard from './components/CourseCard.jsx'
import Footer from './components/Footer.jsx'

function App() {
  return (
    <main className="page">
      <Header />
      <CourseCard title="React for Beginners" lessons={12} />
      <CourseCard title="Python from Zero" lessons={20} />
      <CourseCard title="System Design" lessons={25} />
      <CourseCard title="DevOps Basics" lessons={15} />
      <Footer />
    </main>
  )
}

export default App
