import { useLoaderData, useSearchParams } from 'react-router'
import CourseCard from '../components/CourseCard.jsx'
import styles from './Catalog.module.css'

const LEVELS = ['all', 'beginner', 'intermediate', 'advanced']

export default function Catalog() {
  const courses = useLoaderData()
  const [params, setParams] = useSearchParams()
  const level = params.get('level') ?? 'all'
  const freeOnly = params.get('free') === '1'

  function change(key, value) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next)
  }

  const shown = courses.filter(
    c =>
      (level === 'all' || c.level === level) &&
      (!freeOnly || c.free),
  )

  return (
    <>
      <h1>
        Catalog <small>{shown.length} of {courses.length}</small>
      </h1>
      <div className={styles.filters}>
        {LEVELS.map(l => (
          <button
            key={l}
            className={l === level ? styles.on : styles.btn}
            onClick={() => change('level', l === 'all' ? '' : l)}
          >
            {l}
          </button>
        ))}
        <label>
          <input
            type="checkbox"
            checked={freeOnly}
            onChange={e =>
              change('free', e.target.checked ? '1' : '')
            }
          />
          Free only
        </label>
      </div>
      <div className={styles.grid}>
        {shown.map(c => (
          <CourseCard key={c.slug} course={c} />
        ))}
      </div>
    </>
  )
}
