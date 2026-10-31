import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

export function Modal({ children }: { children: ReactNode }) {
  return createPortal(
    <div className="backdrop">
      <div className="dialog">{children}</div>
    </div>,
    document.body,
  )
}
