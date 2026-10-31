import { Link, NavLink, Outlet } from 'react-router'
import { useAuth } from './auth'
import { can } from './roles'
import type { Page } from './roles'

type ItemProps = { to: string; page: Page; label: string }

function NavItem({ to, page, label }: ItemProps) {
  const { user } = useAuth()
  if (!can(user?.role, page)) return null
  return <NavLink to={to}>{label}</NavLink>
}

export function AppLayout() {
  const { user, signOut } = useAuth()
  return (
    <>
      <header>
        <Link to="/" className="brand">allcsvideos</Link>
        <NavItem to="/my-courses" page="mine" label="My courses" />
        <NavItem to="/studio" page="studio" label="Studio" />
        <NavItem to="/admin" page="admin" label="Admin" />
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
