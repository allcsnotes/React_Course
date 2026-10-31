import { Link, useParams } from 'react-router'
import courses from './data/courses.js'

export default function Lesson() {
  const { slug, lessonId } = useParams()
  const course = courses.find(c => c.slug === slug)
  const n = Number(lessonId)
  const title = course.lessons[n - 1]

  if (!title) {
    throw new Error(`Lesson ${n} does not exist`)
  }

  return (
    <>
      <h2>{title}</h2>
      <p>Lesson {n} of {course.lessons.length}</p>
      <Link
        className="btn"
        to={`/courses/${slug}/lessons/${n + 1}`}
      >
        Next lesson
      </Link>
    </>
  )
}
