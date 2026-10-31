import { useState } from 'react'

function Layout({ children }) {
  const [theme, setTheme] = useState(() =>
    matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark' : 'light'
  )

  return (
    <div className="page" data-theme={theme}>
      <header>
        <strong>allcsvideos</strong>
        <nav>
          <a href="#">Courses</a>
          <a href="#">Pricing</a>
          <a href="#">My courses</a>
        </nav>
        <button onClick={() => setTheme(
          theme === 'dark' ? 'light' : 'dark'
        )}>
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </header>
      <main>{children}</main>
    </div>
  )
}

export default Layout
