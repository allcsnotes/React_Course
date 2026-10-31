import Layout from './Layout.tsx'
import CourseList from './CourseList.tsx'
import Footer from './Footer.tsx'
import './counters.css'

export default function App() {
  return (
    <Layout>
      <CourseList />
      <Footer />
    </Layout>
  )
}
