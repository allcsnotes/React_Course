import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import Link from 'next/link'
import { SITE } from '@/lib/site'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'allcsvideos · Learn to build the web',
    template: '%s · allcsvideos',
  },
  description: 'Calm video courses for total beginners.',
  openGraph: { siteName: 'allcsvideos', type: 'website' },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={geist.className}>
      <body>
        <header className="top">
          <Link href="/" className="brand">
            allcsvideos
          </Link>
          <nav>
            <Link href="/courses">Courses</Link>
          </nav>
        </header>
        <main>{children}</main>
        <footer>allcsvideos · made in Mumbai</footer>
      </body>
    </html>
  )
}
