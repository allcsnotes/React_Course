import styles from './CourseCard.module.css'

export default function CourseCard({ course }) {
  return (
    <div className={styles.card}>
      <img
        className={styles.thumb}
        src={course.image}
        alt=""
        width="56"
        height="56"
      />
      <div className={styles.info}>
        <div className={styles.head}>
          <h3 className={styles.title}>
            {course.title}
          </h3>
          <span className={styles.tag}>
            {course.free ? 'FREE' : 'PAID'}
          </span>
        </div>
        <p className={styles.meta}>
          {course.teacher} · {course.lessons} lessons
        </p>
      </div>
      <button className={styles.btn}>Enroll</button>
    </div>
  )
}
