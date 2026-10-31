import { useEffect, useState, type ChangeEvent, type KeyboardEvent } from 'react'
import { API, ApiMode, modeQuery } from '../lib/api.tsx'

type Course = { id: number; title: string }
type Status = 'idle' | 'loading' | 'done' | 'error'

export default function T01() {
  const [text, setText] = useState('')
  const [query, setQuery] = useState('')
  const [items, setItems] = useState<Course[]>([])
  const [status, setStatus] = useState<Status>('idle')
  const [active, setActive] = useState(-1)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const q = query.trim()
    if (!q) {
      setItems([])
      setStatus('idle')
      return
    }
    const controller = new AbortController()
    // Debounce: wait 250 ms of silence before asking the server.
    const timer = setTimeout(async () => {
      setStatus('loading')
      try {
        const res = await fetch(`${API}/search?q=${encodeURIComponent(q)}${modeQuery()}`, { signal: controller.signal })
        if (!res.ok) throw new Error('bad status')
        const data: { items: Course[] } = await res.json()
        setItems(data.items)
        setStatus('done')
      } catch (e) {
        if ((e as Error).name !== 'AbortError') setStatus('error')
      }
    }, 250)
    // Cleanup: cancel the waiting timer AND abort a request that is already on its way.
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setText(e.target.value)
    setQuery(e.target.value)
    setActive(-1)
    setOpen(true)
  }

  function pick(item: Course) {
    setText(item.title)
    setOpen(false)
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') return setOpen(false)
    if (!items.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => (a + 1) % items.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => (a - 1 + items.length) % items.length)
    } else if (e.key === 'Enter' && active >= 0) {
      pick(items[active])
    }
  }

  const note =
    status === 'loading' ? 'Loading...'
    : status === 'error' ? 'Something went wrong'
    : status === 'done' && !items.length ? 'No courses found'
    : ''

  return (
    <div>
      <ApiMode />
      <div className="box">
        <input
          role="combobox"
          aria-label="Search courses"
          aria-expanded={open}
          aria-controls="list"
          aria-activedescendant={active >= 0 ? `opt-${active}` : undefined}
          value={text}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="Search courses"
        />
        {open && (
          <ul id="list" role="listbox">
            {note && <li className="note">{note}</li>}
            {status === 'done' &&
              items.map((c, i) => (
                <li key={c.id} id={`opt-${i}`} role="option" aria-selected={i === active} onMouseDown={() => pick(c)}>
                  {c.title}
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  )
}
