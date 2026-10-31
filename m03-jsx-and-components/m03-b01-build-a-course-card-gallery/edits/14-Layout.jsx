function Layout({ children }) {
  return (
    <div className="page">
      <header>
        <strong>allcsvideos</strong>
        <span>My courses</span>
      </header>
      <main>{children}</main>
      <footer>© 2026 allcsvideos.com</footer>
    </div>
  )
}

export default Layout
