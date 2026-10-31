import { Link, useOutletContext, useParams } from 'react-router'
import styles from './Lesson.module.css'

export default function Lesson() {
  const { course } = useOutletContext()
  const { id } = useParams()
  const lesson = course.lessons.find(l => l.id === id)

  if (!lesson) return <p>Lesson not found.</p>

  const next = course.lessons.find(l => l.id === lesson.id + 1)

  return (
    <>
      <h1>{lesson.title}</h1>
      <p>
        Lesson {lesson.id} of {course.lessons.length} ·{' '}
        {lesson.minutes} min
      </p>
      <div className={styles.video}>▶ video</div>
      <p>{lesson.summary}</p>
      {next ? (
        <Link to={`/courses/${course.slug}/lessons/${next.id}`}>
          Next lesson: {next.title}
        </Link>
      ) : (
        <Link to={`/courses/${course.slug}`}>
          Back to the course
        </Link>
      )}
    </>
  )
}
