import { Link, Outlet } from 'react-router'

export default function RootLayout() {
  return (
    <>
      <header className="top">
        <Link to="/">allcsvideos</Link>
        <span className="who">Not signed in</span>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}
