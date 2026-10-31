import { useState } from 'react'
import { NavLink } from 'react-router'

export default function Header() {
  const [count, setCount] = useState(0)

  return (
    <header>
      <b className="logo">allcsvideos</b>
      <nav>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/catalog">Catalog</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>
      <button
        className="cart"
        onClick={() => setCount(count + 1)}
      >
        Cart: {count}
      </button>
    </header>
  )
}
