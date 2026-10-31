import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = { title: 'allcsvideos' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="top">
          <span className="brand">
            <img src="/logo.svg" alt="" />
            {process.env.NEXT_PUBLIC_BRAND}
          </span>
          <nav>Courses</nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
