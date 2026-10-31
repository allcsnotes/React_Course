import { useState } from 'react'
import Header from './Header.tsx'
import CourseList from './CourseList.tsx'
import Footer from './Footer.tsx'
import { useRenderCount } from './useRenderCount.ts'
import './counters.css'

export default function App() {
  const n = useRenderCount()
  const [cart, setCart] = useState(0)
  return (
    <div className="app">
      <span className="cnt pg">app {n}</span>
      <Header
        cart={cart}
        onAdd={() => setCart(cart + 1)}
      />
      <CourseList />
      <Footer />
    </div>
  )
}
