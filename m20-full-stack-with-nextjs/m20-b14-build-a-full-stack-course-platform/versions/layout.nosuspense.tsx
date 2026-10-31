import type { Metadata } from 'next'
import Link from 'next/link'
import UserMenu from '@/components/UserMenu'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'allcsvideos', template: '%s · allcsvideos' },
  description: 'Calm video courses for total beginners.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>
        <header className="top">
          <Link href="/" className="brand">
            allcsvideos
          </Link>
          <nav>
            <UserMenu />
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
