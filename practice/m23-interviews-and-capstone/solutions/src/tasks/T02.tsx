import { useEffect, useRef, useState } from 'react'
import { API, ApiMode, modeQuery } from '../lib/api.tsx'

type Item = { id: number; title: string }
type Status = 'idle' | 'loading' | 'end' | 'error'

export default function T02() {
  const [items, setItems] = useState<Item[]>([])
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<Status>('idle')
  const sentinel = useRef<HTMLDivElement>(null)
  const loading = useRef(false) // a lock, so one scroll cannot start two requests

  async function loadMore() {
    if (loading.current) return
    if (status === 'end' || status === 'error') return
    loading.current = true
    setStatus('loading')
    console.log('load page', page)
    try {
      const res = await fetch(`${API}/feed?page=${page}${modeQuery()}`)
      if (!res.ok) throw new Error('bad status')
      const data: { items: Item[]; nextPage: number | null } = await res.json()
      setItems((old) => [...old, ...data.items])
      setPage(data.nextPage ?? page)
      setStatus(data.nextPage ? 'idle' : 'end')
    } catch {
      setStatus('error')
    }
    loading.current = false
  }

  useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void loadMore()
      },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [page, status])

  return (
    <div>
      <ApiMode />
      <div className="counter" data-testid="counter">{items.length} lessons loaded</div>
      {items.map((item) => (
        <div className="feedrow" key={item.id}>{item.title}</div>
      ))}
      <div ref={sentinel} className="sentinel" data-testid="sentinel">
        {status === 'loading' && 'Loading...'}
        {status === 'end' && 'That is all'}
        {status === 'error' && (
          <span>
            Could not load more.
            <button onClick={() => setStatus('idle')}>Retry</button>
          </span>
        )}
      </div>
    </div>
  )
}
