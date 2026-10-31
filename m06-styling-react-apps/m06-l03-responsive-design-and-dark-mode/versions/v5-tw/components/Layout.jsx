function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 bg-white px-6 py-2.5">
        <strong className="text-3xl font-bold text-blue-700">allcsvideos</strong>
        <nav className="flex flex-wrap gap-x-4">
          <a href="#" className="text-blue-700">Courses</a>
          <a href="#" className="text-blue-700">Pricing</a>
          <a href="#" className="text-blue-700">My courses</a>
        </nav>
      </header>
      <main className="px-6 pb-6">{children}</main>
    </div>
  )
}

export default Layout
