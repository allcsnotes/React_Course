import { NavLink, Outlet, useLoaderData, useOutletContext } from 'react-router'
import styles from './CourseLayout.module.css'

const link = ({ isActive }) =>
  isActive ? styles.on : styles.link

export default function CourseLayout() {
  const course = useLoaderData()
  const shared = useOutletContext()

  return (
    <div className={styles.wrap}>
      <aside className={styles.side}>
        <h2>{course.title}</h2>
        <NavLink
          to={`/courses/${course.slug}`}
          end
          className={link}
        >
          Overview
        </NavLink>
        {course.lessons.map(l => (
          <NavLink
            key={l.id}
            to={`/courses/${course.slug}/lessons/${l.id}`}
            className={link}
          >
            {l.id}. {l.title}
          </NavLink>
        ))}
      </aside>
      <section className={styles.content}>
        <Outlet context={{ ...shared, course }} />
      </section>
    </div>
  )
}
