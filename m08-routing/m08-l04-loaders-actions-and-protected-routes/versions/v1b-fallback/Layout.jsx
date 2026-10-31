import { NavLink, Outlet } from 'react-router'

export default function Layout() {
  return (
    <>
      <nav>
        <span className="brand">allcsvideos</span>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/courses">Courses</NavLink>
        <NavLink to="/my-courses">My courses</NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  )
}
