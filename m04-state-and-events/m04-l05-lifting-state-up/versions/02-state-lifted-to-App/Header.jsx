function Header({ count }) {
  return (
    <header>
      <span className="logo">allcsvideos</span>
      <span className="badge">My courses: {count}</span>
    </header>
  )
}

export default Header
