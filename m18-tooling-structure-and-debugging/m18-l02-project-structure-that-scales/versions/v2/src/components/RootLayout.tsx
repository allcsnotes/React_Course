import { NavLink, Outlet } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { useCartStore } from '../features/cart'

export default function RootLayout() {
  const count = useCartStore((state) => state.items.length)
  const { user, logOut } = useAuth()

  return (
    <div className="page">
      <header>
        <strong>allcsvideos</strong>
        <nav>
          <NavLink to="/" end>Courses</NavLink>
          {user ? (
            <>
              <NavLink to="/my-courses">My courses</NavLink>
              <button className="ghost" onClick={logOut}>
                Log out
              </button>
            </>
          ) : (
            <NavLink to="/login">Log in</NavLink>
          )}
        </nav>
        <NavLink to="/cart" className="badge">
          Cart {count}
        </NavLink>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
