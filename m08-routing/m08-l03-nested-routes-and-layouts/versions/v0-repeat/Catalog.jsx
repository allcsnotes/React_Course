import { Link } from 'react-router'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import courses from './data/courses.js'

export default function Catalog() {
  return (
    <div className="shell">
      <Header />
      <main>
        <h2>All courses</h2>
        <div className="grid">
          {courses.map(c => (
            <div className="cc" key={c.slug}>
              <b>{c.title}</b>
              <Link to={`/courses/${c.slug}`}>Open</Link>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
