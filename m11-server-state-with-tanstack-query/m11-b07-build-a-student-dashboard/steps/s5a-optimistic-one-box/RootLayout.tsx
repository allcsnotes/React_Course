import { Link, Outlet } from 'react-router'

export default function RootLayout() {
  return (
    <>
      <header className="top">
        <Link to="/">allcsvideos</Link>
        <span className="who">Lukas · My learning</span>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}
