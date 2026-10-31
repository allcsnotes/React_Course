import { NavLink, Outlet } from 'react-router'
import { useCartStore } from '../cart/cartStore'

export default function RootLayout() {
  const count = useCartStore(
    (state) => state.items.length,
  )

  return (
    <div className="page">
      <header>
        <strong>allcsvideos</strong>
        <nav>
          <NavLink to="/" end>Courses</NavLink>
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
