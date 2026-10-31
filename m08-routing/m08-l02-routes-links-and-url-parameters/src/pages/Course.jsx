import { Link, useNavigate, useParams } from 'react-router'
import courses from '../data/courses.js'
import { enroll } from '../enrolled.js'
import Header from '../Header.jsx'

export default function Course() {
  const { slug } = useParams()
  const navigate = useNavigate()
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

  function handleEnroll() {
    enroll(course.slug)
    navigate('/my-courses')
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
        <button onClick={handleEnroll}>Enroll</button>
      </main>
    </>
  )
}
