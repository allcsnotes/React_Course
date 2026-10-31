import type { ReactNode } from 'react'
import Footer from './Footer.tsx'

type Props = { header: ReactNode; list: ReactNode }

export default function Page({ header, list }: Props) {
  return (
    <main>
      {header}
      {list}
      <Footer />
    </main>
  )
}
