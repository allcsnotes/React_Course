import { useState } from 'react'
import { NavLink, Outlet, useNavigation } from 'react-router'
import styles from './RootLayout.module.css'

const link = ({ isActive }) =>
  isActive ? styles.on : styles.link

export default function RootLayout() {
  const [enrolled, setEnrolled] = useState([])
  const navigation = useNavigation()

  function toggleEnroll(slug) {
    setEnrolled(list =>
      list.includes(slug)
        ? list.filter(s => s !== slug)
        : [...list, slug],
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <strong>allcsvideos</strong>
        <nav>
          <NavLink to="/" end className={link}>Home</NavLink>
          <NavLink to="/catalog" className={link}>Catalog</NavLink>
        </nav>
        {navigation.state === 'loading' && (
          <span className={styles.loading}>Loading...</span>
        )}
        <span className={styles.badge}>
          My courses {enrolled.length}
        </span>
      </header>
      <main className={styles.main}>
        <Outlet context={{ enrolled, toggleEnroll }} />
      </main>
      <footer className={styles.footer}>
        © 2026 allcsvideos.com
      </footer>
    </div>
  )
}
