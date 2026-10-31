function Layout({ children }) {
  return (
    <div className="layout">
      <header>allcsvideos</header>
      <main>{children}</main>
      <footer>allcsvideos.com</footer>
    </div>
  )
}

export default Layout
