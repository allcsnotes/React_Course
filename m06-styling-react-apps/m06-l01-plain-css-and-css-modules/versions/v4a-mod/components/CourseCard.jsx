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
        <h3 className={styles.title}>
          {course.title}
        </h3>
        <p className={styles.meta}>
          {course.teacher} · {course.lessons} lessons
        </p>
      </div>
      <button className={styles.btn}>Enroll</button>
    </div>
  )
}
