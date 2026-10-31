import { NavLink, Outlet } from 'react-router'
import styles from './RootLayout.module.css'

const link = ({ isActive }) =>
  isActive ? styles.on : styles.link

export default function RootLayout() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <strong>allcsvideos</strong>
        <nav>
          <NavLink to="/" end className={link}>Home</NavLink>
          <NavLink to="/catalog" className={link}>Catalog</NavLink>
        </nav>
        <span className={styles.badge}>My courses 0</span>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        © 2026 allcsvideos.com
      </footer>
    </div>
  )
}
