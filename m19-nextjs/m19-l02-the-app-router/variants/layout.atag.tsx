import Link from 'next/link'
import './globals.css'

export const metadata = { title: 'allcsvideos' }

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>
        <header>
          <strong>allcsvideos</strong>
          <Link href="/">Home</Link>
          <Link href="/courses">Courses</Link>
          <a href="/about">About</a>
          <input placeholder="Search courses" />
        </header>
        {children}
      </body>
    </html>
  )
}
