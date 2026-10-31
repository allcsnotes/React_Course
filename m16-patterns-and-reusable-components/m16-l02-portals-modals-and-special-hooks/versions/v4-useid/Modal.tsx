import { useEffect, useId, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type Props = { title: string; onClose: () => void; children: ReactNode }

export function Modal({ title, onClose, children }: Props) {
  const titleId = useId()
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
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <h3 id={titleId}>{title}</h3>
        {children}
      </div>
    </div>,
    document.body,
  )
}
