import { useRenderCount } from './useRenderCount.ts'
import Header from './Header.tsx'
import CourseList from './CourseList.tsx'
import Footer from './Footer.tsx'

export default function Page() {
  const n = useRenderCount()
  return (
    <>
      <Header />
      <span className="cnt pg">page {n}</span>
      <CourseList />
      <Footer />
    </>
  )
}
