import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type Props = { onClose: () => void; children: ReactNode }

export function Modal({ onClose, children }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <div
      className="backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="dialog" role="dialog" aria-modal="true">
        {children}
      </div>
    </div>,
    document.body,
  )
}
