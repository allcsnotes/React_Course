import './globals.css'
import Link from 'next/link'

export const metadata = { title: 'allcsvideos' }

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"><body>
      <nav><b>allcsvideos</b><Link href="/">Shop</Link><Link href="/instructor">Instructor</Link></nav>
      <main>{children}</main>
    </body></html>
  )
}
