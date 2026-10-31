import { useState } from 'react'
import styles from './Progress.module.css'

export default function Progress({ total }) {
  const [done, setDone] = useState(4)
  const percent = Math.round((done / total) * 100)

  return (
    <div className={styles.panel}>
      <p className={styles.label}>
        {done} of {total} lessons · {percent}%
      </p>
      <div className={styles.track}>
        <div className={styles.fill} />
      </div>
      <button
        className={styles.btn}
        onClick={() => setDone(done + 1)}
      >
        Finish a lesson
      </button>
    </div>
  )
}
