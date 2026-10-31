import { Outlet } from 'react-router'
import Header from './Header.jsx'
import Footer from './Footer.jsx'

export default function RootLayout() {
  return (
    <div className="shell">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
