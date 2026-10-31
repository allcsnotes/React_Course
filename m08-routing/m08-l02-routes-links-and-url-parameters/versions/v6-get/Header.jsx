import { NavLink } from 'react-router'

export default function Header() {
  return (
    <header>
      <b className="logo">allcsvideos</b>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/catalog">Catalog</NavLink>
        <NavLink to="/my-courses">My courses</NavLink>
      </nav>
    </header>
  )
}
