import { Link, useLoaderData } from 'react-router'
import CourseCard from '../components/CourseCard.jsx'
import styles from './Home.module.css'

export default function Home() {
  const courses = useLoaderData()
  const featured = courses.slice(0, 3)

  return (
    <>
      <section className={styles.hero}>
        <h1>Learn computer science, one lesson at a time</h1>
        <Link to="/catalog" className={styles.cta}>
          Browse the catalog
        </Link>
      </section>
      <h2>Featured courses</h2>
      <div className={styles.grid}>
        {featured.map(c => (
          <CourseCard key={c.slug} course={c} />
        ))}
      </div>
    </>
  )
}
