import { Link } from 'react-router'
import courses from '../data/courses.js'
import Header from '../Header.jsx'

export default function Catalog() {
  const shown = courses

  return (
    <>
      <Header />
      <main>
        <h2>Catalog</h2>
        <div className="grid2">
          {shown.map(c => (
            <Link
              key={c.id}
              className="course"
              to={`/courses/${c.slug}`}
            >
              <b>{c.title}</b>
              <span>
                {c.teacher} · {c.level} · {c.free ? 'Free' : `Rs ${c.price}`}
              </span>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}
