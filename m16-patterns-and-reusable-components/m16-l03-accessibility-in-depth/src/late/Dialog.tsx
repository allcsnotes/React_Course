import { useEffect, useRef } from 'react'
import type { KeyboardEvent } from 'react'

export function Dialog({ onClose }: { onClose: (yes: boolean) => void }) {
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    box.current?.querySelector('button')?.focus()
    return () => opener?.focus()
  }, [])

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose(false)
    if (e.key !== 'Tab') return
    const items = box.current!.querySelectorAll('button')
    const first = items[0]
    const last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <div className="overlay">
      <div
        ref={box}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dlg-title"
        className="box"
        onKeyDown={onKey}
      >
        <h2 id="dlg-title">Enroll in Python from Zero?</h2>
        <div className="btns">
          <button onClick={() => onClose(true)}>Yes, enroll</button>
          <button className="plain" onClick={() => onClose(false)}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
