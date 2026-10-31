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
      <main>
        <img className="hero" src="/banner.svg" alt="Learn" />
        {children}
      </main>
    </div>
  )
}

export default Layout
