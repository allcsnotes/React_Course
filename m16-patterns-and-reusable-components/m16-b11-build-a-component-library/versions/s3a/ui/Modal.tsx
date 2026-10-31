import { useEffect, useId, useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'

export type ModalProps = {
  open: boolean
  onClose: () => void
  /** The heading, and the dialog's name. */
  title: string
  children: ReactNode
}

type DialogProps = Omit<ModalProps, 'open'>

const FOCUSABLE =
  'button, input, a[href], [tabindex]:not([tabindex="-1"])'

export function Modal({ open, ...rest }: ModalProps) {
  if (!open) return null
  return createPortal(<Dialog {...rest} />, document.body)
}

function Dialog({ onClose, title, children }: DialogProps) {
  const titleId = useId()
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    box.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus()
  }, [])

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') return onClose()
    if (e.key !== 'Tab') return
    const all = box.current!.querySelectorAll<HTMLElement>(FOCUSABLE)
    const first = all[0]
    const last = all[all.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <div className="backdrop" onMouseDown={onClose}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={box}
        onKeyDown={onKeyDown}
        onMouseDown={e => e.stopPropagation()}
      >
        <button className="x" aria-label="Close" onClick={onClose}>
          ×
        </button>
        <h2 id={titleId}>{title}</h2>
        {children}
      </div>
    </div>
  )
}
