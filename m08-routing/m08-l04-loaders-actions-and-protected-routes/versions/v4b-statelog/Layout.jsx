import { useEffect } from 'react'
import { NavLink, Outlet, useNavigation } from 'react-router'

export default function Layout() {
  const navigation = useNavigation()
  const busy = navigation.state !== 'idle'

  useEffect(() => {
    console.log('state:', navigation.state)
  }, [navigation.state])

  return (
    <>
      <nav>
        <span className="brand">allcsvideos</span>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/courses">Courses</NavLink>
        <NavLink to="/my-courses">My courses</NavLink>
        <span className="state" data-busy={busy}>
          {busy ? 'Loading…' : 'Ready'}
        </span>
      </nav>
      <main className={busy ? 'busy' : ''}>
        <Outlet />
      </main>
    </>
  )
}
