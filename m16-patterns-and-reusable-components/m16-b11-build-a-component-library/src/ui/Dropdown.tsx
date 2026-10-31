import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

export type DropdownItem = { id: string; label: string }

export type DropdownProps = {
  /** Text on the button that opens the menu. */
  label: string
  items: DropdownItem[]
  /** Called with the id of the chosen item. */
  onSelect: (id: string) => void
}

export function Dropdown({ label, items, onSelect }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const button = useRef<HTMLButtonElement>(null)
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const menuId = useId()

  useEffect(() => {
    if (open) refs.current[active]?.focus()
  }, [open, active])

  useEffect(() => {
    if (!open) return
    const away = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.dd')) setOpen(false)
    }
    document.addEventListener('mousedown', away)
    return () => document.removeEventListener('mousedown', away)
  }, [open])

  function close() {
    setOpen(false)
    button.current?.focus()
  }

  function onButtonKey(e: KeyboardEvent) {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    setActive(e.key === 'ArrowUp' ? items.length - 1 : 0)
    setOpen(true)
  }

  function onMenuKey(e: KeyboardEvent) {
    const n = items.length
    const go: Record<string, number> = {
      ArrowDown: active + 1,
      ArrowUp: active - 1,
      Home: 0,
      End: n - 1,
    }
    if (e.key in go) {
      e.preventDefault()
      setActive((go[e.key] + n) % n)
    } else if (e.key === 'Escape') close()
    else if (e.key === 'Tab') setOpen(false)
  }

  return (
    <div className="dd">
      <button
        ref={button}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => { setActive(0); setOpen(o => !o) }}
        onKeyDown={onButtonKey}
      >
        {label} <span aria-hidden>▾</span>
      </button>
      {open && (
        <div
          className="menu"
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKey}
        >
          {items.map((item, i) => (
            <button
              key={item.id}
              role="menuitem"
              tabIndex={-1}
              ref={el => { refs.current[i] = el }}
              onClick={() => { onSelect(item.id); close() }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
