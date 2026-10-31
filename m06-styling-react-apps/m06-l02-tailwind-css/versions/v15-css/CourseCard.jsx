import styles from './CourseCard.module.css'

export default function CourseCard({ course }) {
  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <img src={course.image} alt="" className={styles.thumb} />
        <div className={styles.info}>
          <h2 className={styles.title}>{course.title}</h2>
          <p className={styles.meta}>by {course.teacher} · {course.lessons} lessons</p>
        </div>
      </div>
      <div className={styles.bottom}>
        <p className={styles.price}>Rs {course.price}</p>
        <button className={styles.btn}>Enroll</button>
      </div>
    </article>
  )
}
