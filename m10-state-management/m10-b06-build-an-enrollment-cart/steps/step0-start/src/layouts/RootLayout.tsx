import { NavLink, Outlet } from 'react-router'

export default function RootLayout() {
  return (
    <div className="page">
      <header>
        <strong>allcsvideos</strong>
        <nav>
          <NavLink to="/" end>Courses</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
