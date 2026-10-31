import { Link } from 'react-router'
import Header from '../Header.jsx'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <h1>Learn to build real software</h1>
        <p>Short video courses from Meera, Rahul and Asha.</p>
        <Link className="cta" to="/catalog">
          Browse courses
        </Link>
      </main>
    </>
  )
}
