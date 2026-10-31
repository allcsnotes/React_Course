function Layout({ children }) {
  return (
    <div className="page">
      <header>
        <strong>allcsvideos</strong>
        <nav>
          <a href="#">Courses</a>
          <a href="#">Pricing</a>
          <a href="#">My courses</a>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  )
}

export default Layout
