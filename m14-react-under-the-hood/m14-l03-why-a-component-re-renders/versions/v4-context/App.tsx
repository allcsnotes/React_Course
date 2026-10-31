import { ThemeProvider } from './ThemeContext.tsx'
import Header from './Header.tsx'
import CourseList from './CourseList.tsx'
import Footer from './Footer.tsx'
import './counters.css'

export default function App() {
  return (
    <ThemeProvider>
      <Header />
      <CourseList />
      <Footer />
    </ThemeProvider>
  )
}
