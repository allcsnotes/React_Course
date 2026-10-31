import Header from './Header.tsx'
import CourseList from './CourseList.tsx'
import Footer from './Footer.tsx'
import { useRenderCount } from './useRenderCount.ts'
import './counters.css'

export default function App() {
  const n = useRenderCount()
  return (
    <div className="app">
      <span className="cnt pg">app {n}</span>
      <Header />
      <CourseList />
      <Footer />
    </div>
  )
}
