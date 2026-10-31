import { Link, NavLink, Outlet } from 'react-router'
import { useAuth } from './auth'

type ItemProps = { to: string; label: string }

function NavItem({ to, label }: ItemProps) {
  const { user } = useAuth()
  if (!user) return null
  return <NavLink to={to}>{label}</NavLink>
}

export function AppLayout() {
  const { user, signOut } = useAuth()
  return (
    <>
      <header>
        <Link to="/" className="brand">allcsvideos</Link>
        <NavItem to="/my-courses" label="My courses" />
        <NavItem to="/studio" label="Studio" />
        <NavItem to="/admin" label="Admin" />
        <span className="who">
          {user ? (
            <>
              {user.name} <b className={user.role}>{user.role}</b>
              <button onClick={signOut}>Sign out</button>
            </>
          ) : (
            <Link to="/login">Sign in</Link>
          )}
        </span>
      </header>
      <main><Outlet /></main>
    </>
  )
}
