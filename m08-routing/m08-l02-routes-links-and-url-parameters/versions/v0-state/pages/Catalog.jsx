import { useState } from 'react'
import { Link } from 'react-router'
import courses from '../data/courses.js'
import Header from '../Header.jsx'

export default function Catalog() {
  const [level, setLevel] = useState('')
  const [freeOnly, setFreeOnly] =
    useState(false)

  const shown = courses.filter(c =>
    (level === '' || c.level === level) &&
    (!freeOnly || c.free),
  )

  return (
    <>
      <Header />
      <main>
        <h2>Catalog</h2>
        <div className="filters">
          <select
            value={level}
            onChange={e => setLevel(e.target.value)}
          >
            <option value="">All levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <label className="free">
            <input
              type="checkbox"
              checked={freeOnly}
              onChange={e => setFreeOnly(e.target.checked)}
            />
            Free only
          </label>
          <span className="count">{shown.length} shown</span>
        </div>
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
