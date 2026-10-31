import { Link } from 'react-router'

export default function Home() {
  return (
    <>
      <h1>Learn by building</h1>
      <p>Courses for people who are just starting.</p>
      <Link className="btn" to="/catalog">
        See the catalog
      </Link>
    </>
  )
}
