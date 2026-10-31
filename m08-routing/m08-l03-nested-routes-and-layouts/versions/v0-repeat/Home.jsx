import { Link } from 'react-router'
import Header from './Header.jsx'
import Footer from './Footer.jsx'

export default function Home() {
  return (
    <div className="shell">
      <Header />
      <main>
        <h1>Learn by building</h1>
        <p>Courses for people who are just starting.</p>
        <Link className="btn" to="/catalog">
          See the catalog
        </Link>
      </main>
      <Footer />
    </div>
  )
}
