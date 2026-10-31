import Header from './components/Header.jsx'
import CourseCard from './components/CourseCard.jsx'
import Footer from './components/Footer.jsx'

function App() {
  return (
    <main className="page">
      <Header />
      <CourseCard
        title="React for Beginners"
        teacher="Meera"
        lessons={12}
      />
      <CourseCard
        title="Python from Zero"
        teacher="Meera"
        lessons={20}
      />
      <CourseCard
        title="System Design"
        teacher="Rahul"
        lessons={25}
      />
      <CourseCard
        title="DevOps Basics"
        teacher="Asha"
        lessons={15}
      />
      <Footer />
    </main>
  )
}

export default App
