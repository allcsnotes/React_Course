import { useCallback, useEffect, useRef, useState } from 'react'

type Kind = 'success' | 'error'
type ToastData = { id: number; kind: Kind; text: string }
const MAX = 3

function ToastItem({ toast, ms, onClose }: { toast: ToastData; ms: number; onClose: (id: number) => void }) {
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused) return // hovering stops the clock
    const t = setTimeout(() => onClose(toast.id), ms)
    return () => clearTimeout(t)
  }, [paused, ms, onClose, toast.id])
  return (
    <div
      className={`toast ${toast.kind}`}
      role={toast.kind === 'error' ? 'alert' : 'status'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <span>{toast.text}</span>
      <button aria-label={`Close: ${toast.text}`} onClick={() => onClose(toast.id)}>×</button>
    </div>
  )
}

export default function T06() {
  const [toasts, setToasts] = useState<ToastData[]>([])
  const [ms, setMs] = useState(4000)
  const nextId = useRef(1)
  const close = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), [])

  function push(kind: Kind) {
    const id = nextId.current++
    const text = kind === 'success' ? `Saved (${id})` : `Could not save (${id})`
    setToasts((t) => [...t, { id, kind, text }].slice(-MAX)) // keep the newest 3
  }

  return (
    <div>
      <label>
        Time on screen{' '}
        <select value={ms} onChange={(e) => setMs(Number(e.target.value))}>
          <option value={1500}>1.5 s</option>
          <option value={4000}>4 s</option>
        </select>
      </label>
      <div>
        <button onClick={() => push('success')}>Add success toast</button>
        <button onClick={() => push('error')}>Add error toast</button>
      </div>
      <p data-testid="count">{toasts.length === 0 ? 'No toasts' : `${toasts.length} toast${toasts.length > 1 ? 's' : ''} on screen`}</p>
      <div className="toasts" aria-label="Notifications">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} ms={ms} onClose={close} />
        ))}
      </div>
    </div>
  )
}
