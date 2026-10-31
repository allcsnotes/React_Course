import { useEffect, useRef, useState, type KeyboardEvent } from 'react'

const FOCUSABLE = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'

function Dialog({ onClose }: { onClose: () => void }) {
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    box.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus() // move focus in
    return () => opener?.focus() // give focus back to the button that opened the dialog
  }, [])

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') return onClose()
    if (e.key !== 'Tab') return
    const items = [...(box.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])]
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
    <div className="backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="dlg-title" ref={box} onKeyDown={onKeyDown}>
        <h2 id="dlg-title">Unenroll from React for Beginners?</h2>
        <label>
          Reason <input type="text" aria-label="Reason" />
        </label>
        <div>
          <button onClick={onClose}>Keep my place</button>
          <button onClick={onClose}>Unenroll</button>
        </div>
      </div>
    </div>
  )
}

export default function T07() {
  const [open, setOpen] = useState(false)
  const [focus, setFocus] = useState('nothing')

  useEffect(() => {
    const h = () => {
      const el = document.activeElement as HTMLElement | null
      setFocus(el === null || el === document.body ? 'the page body' : el.getAttribute('aria-label') ?? el.textContent ?? el.tagName)
    }
    const out = () => setTimeout(h, 0)
    document.addEventListener('focusin', h)
    document.addEventListener('focusout', out)
    return () => {
      document.removeEventListener('focusin', h)
      document.removeEventListener('focusout', out)
    }
  }, [])

  return (
    <div>
      <div inert={open}>
        <button onClick={() => setOpen(true)}>Open unenroll dialog</button>
        <button>Another page button</button>
      </div>
      {open && <Dialog onClose={() => setOpen(false)} />}
      <p data-testid="focus">Focus is on: {focus}</p>
    </div>
  )
}
