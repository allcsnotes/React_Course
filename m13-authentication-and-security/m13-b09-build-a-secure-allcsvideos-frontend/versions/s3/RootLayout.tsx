import { Link, Outlet } from 'react-router'
import { useAuth } from './AuthContext.tsx'
import { can } from './roles.ts'
import type { Page } from './roles.ts'

function NavItem(props: { to: string; page: Page; label: string }) {
  const { user } = useAuth()
  if (!can(user?.role, props.page)) return null
  return <Link to={props.to}>{props.label}</Link>
}

export default function RootLayout() {
  const { user, logOut } = useAuth()
  return (
    <>
      <header className="top">
        <Link to="/">allcsvideos</Link>
        <nav>
          <NavItem to="/studio" page="studio" label="Studio" />
          <NavItem to="/admin" page="admin" label="Admin" />
          {user ? (
            <>
              <span className="who">{user.name} · {user.role}</span>
              <button className="ghost" onClick={logOut}>
                Log out
              </button>
            </>
          ) : (
            <Link to="/login">Log in</Link>
          )}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}
