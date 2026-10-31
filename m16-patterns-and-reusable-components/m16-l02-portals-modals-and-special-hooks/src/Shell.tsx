import type { ReactNode } from 'react'

export function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <header>
        <strong>allcsvideos</strong>
        <span className="tag">My courses</span>
      </header>
      <main>{children}</main>
    </>
  )
}
