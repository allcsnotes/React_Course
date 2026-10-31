import { useState } from 'react'

function Layout({ children }) {
  const [theme, setTheme] = useState(() =>
    matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark' : 'light'
  )

  return (
    <div data-theme={theme} className="min-h-screen bg-slate-100
      text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 bg-white px-6 py-2.5 dark:bg-slate-900">
        <strong className="text-3xl font-bold text-blue-700 dark:text-blue-400">allcsvideos</strong>
        <nav className="flex flex-wrap gap-x-4">
          <a href="#" className="text-blue-700 dark:text-blue-400">Courses</a>
          <a href="#" className="text-blue-700 dark:text-blue-400">Pricing</a>
          <a href="#" className="text-blue-700 dark:text-blue-400">My courses</a>
        </nav>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-full border border-slate-300 px-4 py-1.5 dark:border-slate-600"
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </header>
      <main className="px-6 pb-6">{children}</main>
    </div>
  )
}

export default Layout
