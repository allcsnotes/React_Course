import { Link, Outlet } from 'react-router'
import { useAuth } from './AuthContext.tsx'

export default function RootLayout() {
  const { user, logOut } = useAuth()
  return (
    <>
      <header className="top">
        <Link to="/">allcsvideos</Link>
        <nav>
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
