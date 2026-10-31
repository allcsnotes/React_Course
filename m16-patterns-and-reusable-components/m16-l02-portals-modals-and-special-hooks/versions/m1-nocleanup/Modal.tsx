import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type Props = { onClose: () => void; children: ReactNode }

export function Modal({ onClose, children }: Props) {
  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        console.log('Escape heard')
        onClose()
      }
    })
  }, [onClose])

  return createPortal(
    <div className="backdrop">
      <div className="dialog" role="dialog" aria-modal="true">
        {children}
      </div>
    </div>,
    document.body,
  )
}
