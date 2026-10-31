import { Link } from 'react-router'
import courses from '../data/courses.js'
import { getEnrolled } from '../enrolled.js'
import Header from '../Header.jsx'

export default function MyCourses() {
  const mine = courses.filter(c => getEnrolled().includes(c.slug))

  return (
    <>
      <Header />
      <main>
        <h2>My courses</h2>
        {mine.length === 0 ? (
          <p>
            Nothing yet.{' '}
            <Link to="/catalog">Browse the catalog</Link>
          </p>
        ) : (
          <ul className="mine">
            {mine.map(c => (
              <li key={c.id}>
                <Link to={`/courses/${c.slug}`}>{c.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  )
}
