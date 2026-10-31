import { Link } from 'react-router'

export default function Header() {
  return (
    <header>
      <b className="logo">allcsvideos</b>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/catalog">Catalog</Link>
        <Link to="/my-courses">My courses</Link>
      </nav>
    </header>
  )
}
