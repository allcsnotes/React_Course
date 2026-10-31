import { Link } from 'react-router'
import formatPrice from '../utils/formatPrice.js'
import styles from './CourseCard.module.css'

export default function CourseCard({ course }) {
  return (
    <article className={styles.card}>
      <h3>
        <Link to={`/courses/${course.slug}`}>
          {course.title}
        </Link>
      </h3>
      <p>{course.teacher} · {course.lessonCount} lessons</p>
      <p>{formatPrice(course.price)}</p>
    </article>
  )
}
