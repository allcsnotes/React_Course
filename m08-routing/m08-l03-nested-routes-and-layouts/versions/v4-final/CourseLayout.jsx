import { NavLink, Outlet, useParams } from 'react-router'
import courses from './data/courses.js'

export default function CourseLayout() {
  const { slug } = useParams()
  const course = courses.find(c => c.slug === slug)

  return (
    <div className="course">
      <aside>
        <h3>{course.title}</h3>
        {course.lessons.map((title, i) => (
          <NavLink key={title} to={`lessons/${i + 1}`}>
            {i + 1}. {title}
          </NavLink>
        ))}
      </aside>
      <section>
        <Outlet />
      </section>
    </div>
  )
}
