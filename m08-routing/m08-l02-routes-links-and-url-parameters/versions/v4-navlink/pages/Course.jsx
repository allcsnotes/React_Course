import { Link, useParams } from 'react-router'
import courses from '../data/courses.js'
import Header from '../Header.jsx'

export default function Course() {
  const { slug } = useParams()
  const course = courses.find(c => c.slug === slug)

  if (!course) {
    return (
      <>
        <Header />
        <main>
          <h2>Course not found</h2>
          <p>There is no course called "{slug}".</p>
          <Link to="/catalog">
            Back to the catalog
          </Link>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main>
        <h2>{course.title}</h2>
        <p className="meta">
          by {course.teacher} · {course.lessons} lessons
        </p>
        <p className="price">
          {course.free ? 'Free' : `Rs ${course.price}`}
        </p>
        <button>Enroll</button>
      </main>
    </>
  )
}
