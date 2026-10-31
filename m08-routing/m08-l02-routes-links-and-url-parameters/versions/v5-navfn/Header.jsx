import { NavLink } from 'react-router'

export default function Header() {
  return (
    <header>
      <b className="logo">allcsvideos</b>
      <nav>
        <NavLink
          to="/catalog"
          className={({ isActive }) =>
            isActive ? 'tab on' : 'tab'
          }
        >
          Catalog
        </NavLink>
      </nav>
    </header>
  )
}
