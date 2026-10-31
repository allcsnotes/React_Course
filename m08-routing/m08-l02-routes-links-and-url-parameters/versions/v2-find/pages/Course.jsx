import { useParams } from 'react-router'
import courses from '../data/courses.js'
import Header from '../Header.jsx'

export default function Course() {
  const { slug } = useParams()
  const course = courses.find(c => c.slug === slug)

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
