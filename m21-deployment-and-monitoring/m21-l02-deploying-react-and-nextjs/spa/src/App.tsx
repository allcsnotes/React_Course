import { Link, Route, Routes } from 'react-router'
import Catalog from './Catalog'
import Course from './Course'

export const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8212'

export default function App() {
  return (
    <>
      <header className="top">
        <Link to="/" className="brand">allcsvideos</Link>
        <nav><Link to="/courses">Courses</Link></nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Catalog />} />
          <Route path="/courses/:slug" element={<Course />} />
        </Routes>
      </main>
    </>
  )
}

function Home() {
  return (
    <section className="hero">
      <h1>Learn to build the web</h1>
      <p>Eight short courses, from your first page to production.</p>
      <Link to="/courses" className="btn">See the courses</Link>
    </section>
  )
}
