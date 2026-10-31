import { Link, useSearchParams } from 'react-router'
import courses from '../data/courses.js'
import Header from '../Header.jsx'

export default function Catalog() {
  const [searchParams, setSearchParams] =
    useSearchParams()
  const level = searchParams.get('level') ?? ''
  const freeOnly = searchParams.get('free') === 'true'

  const shown = courses.filter(c =>
    (level === '' || c.level === level) &&
    (!freeOnly || c.free),
  )

  function setParam(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  return (
    <>
      <Header />
      <main>
        <h2>Catalog</h2>
        <div className="filters">
          <select
            value={level}
            onChange={e =>
              setParam('level', e.target.value)
            }
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
              onChange={e =>
                setParam('free', e.target.checked ? 'true' : '')
              }
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
              to={c.slug}
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
