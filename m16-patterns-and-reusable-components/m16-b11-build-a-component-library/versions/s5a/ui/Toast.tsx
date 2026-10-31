import { createContext, useContext, useRef, useState } from 'react'
import type { ReactNode } from 'react'

type ToastItem = { id: number; text: string }
type Show = (text: string) => void

const ToastContext = createContext<Show | null>(null)

export function useToast() {
  const show = useContext(ToastContext)
  if (!show) throw new Error('useToast needs <ToastProvider>')
  return show
}

export type ToastProviderProps = {
  /** How long each toast stays, in seconds. */
  seconds?: number
  children: ReactNode
}

export function ToastProvider(props: ToastProviderProps) {
  const { seconds = 4, children } = props
  const [items, setItems] = useState<ToastItem[]>([])
  const next = useRef(1)

  function dismiss(id: number) {
    setItems(list => list.filter(t => t.id !== id))
  }

  function show(text: string) {
    const id = next.current++
    setItems(list => [...list, { id, text }])
    setTimeout(() => dismiss(id), seconds * 1000)
  }

  return (
    <ToastContext value={show}>
      {children}
      <div className="toasts">
        {items.map(t => (
          <div className="toast" key={t.id}>
            {t.text}
            <button aria-label="Dismiss" onClick={() => dismiss(t.id)}>
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext>
  )
}
