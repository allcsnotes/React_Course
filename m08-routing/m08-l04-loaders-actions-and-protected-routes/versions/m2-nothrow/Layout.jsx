import { NavLink, Outlet, useNavigation } from 'react-router'

export default function Layout() {
  const navigation = useNavigation()
  const busy = navigation.state !== 'idle'

  return (
    <>
      <nav>
        <span className="brand">allcsvideos</span>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/courses">Courses</NavLink>
        <NavLink to="/my-courses">My courses</NavLink>
        <NavLink to="/login">Sign in</NavLink>
        <span className="state" data-busy={busy}>
          {busy ? 'Loading…' : ''}
        </span>
      </nav>
      <main className={busy ? 'busy' : ''}>
        <Outlet />
      </main>
    </>
  )
}
