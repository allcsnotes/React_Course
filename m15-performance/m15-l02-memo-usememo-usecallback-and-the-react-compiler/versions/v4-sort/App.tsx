import { useCallback, useState } from 'react'
import Header from './Header.tsx'
import CourseList from './CourseList.tsx'
import Footer from './Footer.tsx'
import { allCourses, type Course } from './data.ts'
import { useRenderCount } from './useRenderCount.ts'
import './counters.css'

function cheapest(list: Course[]) {
  console.log('sorting', list.length, 'courses')
  return [...list].sort((a, b) => a.price - b.price).slice(0, 3)
}

export default function App() {
  const n = useRenderCount()
  const [cart, setCart] = useState(0)
  const open = useCallback((slug: string) => {
    console.log('open', slug)
  }, [])
  const top = cheapest(allCourses)
  return (
    <div className="app">
      <span className="cnt pg">app {n}</span>
      <Header cart={cart} onAdd={() => setCart(cart + 1)} />
      <CourseList courses={top} onOpen={open} />
      <Footer />
    </div>
  )
}
