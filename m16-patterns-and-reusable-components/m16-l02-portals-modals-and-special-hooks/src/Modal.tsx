import type { ReactNode } from 'react'

export function Modal({ children }: { children: ReactNode }) {
  return (
    <div className="backdrop">
      <div className="dialog">{children}</div>
    </div>
  )
}
