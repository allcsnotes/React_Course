import { useCallback, useState } from 'react'
import Header from './Header.tsx'
import CourseList from './CourseList.tsx'
import Footer from './Footer.tsx'
import { courses } from './data.ts'
import { useRenderCount } from './useRenderCount.ts'
import './counters.css'

export default function App() {
  const n = useRenderCount()
  const [cart, setCart] = useState(0)
  const open = useCallback((slug: string) => {
    console.log('open', slug)
  }, [])
  return (
    <div className="app">
      <span className="cnt pg">app {n}</span>
      <Header cart={cart} onAdd={() => setCart(cart + 1)} />
      <CourseList courses={courses} onOpen={open} />
      <Footer />
    </div>
  )
}
