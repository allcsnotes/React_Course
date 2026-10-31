import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

type Props = { onClose: () => void; children: ReactNode }

export function Modal({ children }: Props) {
  return createPortal(
    <div className="backdrop">
      <div className="dialog">{children}</div>
    </div>,
    document.getElementById('modal-root')!,
  )
}
