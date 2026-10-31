import { useEffect, useState } from 'react'

const API = 'http://localhost:8232'

export default function Autocomplete() {
  const [text, setText] = useState('')
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('idle')
  const [active, setActive] = useState(-1)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const q = text.trim()
    if (!q) { setItems([]); setStatus('idle'); return }
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setStatus('loading')
      try {
        const url = `${API}/search?q=${encodeURIComponent(q)}`
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) throw new Error('bad status')
        setItems((await res.json()).items)
        setStatus('done')
      } catch (e) {
        if (e.name !== 'AbortError') setStatus('error')
      }
    }, 250)
    return () => { clearTimeout(timer); controller.abort() }
  }, [text])

  function onChange(e) {
    setText(e.target.value)
    setActive(-1)
    setOpen(true)
  }

  function pick(item) {
    setText(item.title)
    setOpen(false)
  }

  function onKeyDown(e) {
    if (!items.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive(a => (a + 1) % items.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive(a => (a - 1 + items.length) % items.length)
    } else if (e.key === 'Enter' && active >= 0) {
      pick(items[active])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const note = status === 'loading' ? 'Loading...'
    : status === 'error' ? 'Something went wrong'
    : status === 'done' && !items.length ? 'No courses found' : ''

  return (
    <div className="box">
      <input role="combobox" aria-expanded={open} aria-controls="list"
        aria-activedescendant={active >= 0 ? `opt-${active}` : undefined}
        value={text} onChange={onChange} onKeyDown={onKeyDown}
        placeholder="Search courses" />
      {open && (
        <ul id="list" role="listbox">
          {note && <li className="note">{note}</li>}
          {status === 'done' && items.map((c, i) => (
            <li key={c.id} id={`opt-${i}`} role="option"
              aria-selected={i === active} onMouseDown={() => pick(c)}>
              {c.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
