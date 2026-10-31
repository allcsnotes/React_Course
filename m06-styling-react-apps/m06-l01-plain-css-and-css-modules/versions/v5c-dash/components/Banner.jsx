import styles from './Banner.module.css'

export default function Banner() {
  return (
    <div className={styles.banner}>
      <h2 className={styles.title}>
        Featured this week
      </h2>
    </div>
  )
}
