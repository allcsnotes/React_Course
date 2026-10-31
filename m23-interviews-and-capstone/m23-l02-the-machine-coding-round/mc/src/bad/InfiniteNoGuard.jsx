import { useEffect, useRef, useState } from 'react'

const API = 'http://localhost:8232'

export default function InfiniteList() {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('idle')
  const sentinel = useRef(null)

  async function loadMore() {
    if (status === 'end' || status === 'error') return
    setStatus('loading')
    console.log('load page', page)
    try {
      const res = await fetch(`${API}/feed?page=${page}`)
      if (!res.ok) throw new Error('bad status')
      const data = await res.json()
      setItems(old => [...old, ...data.items])
      setPage(data.nextPage ?? page)
      setStatus(data.nextPage ? 'idle' : 'end')
    } catch {
      setStatus('error')
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadMore()
    }, { rootMargin: '200px' })
    observer.observe(sentinel.current)
    return () => observer.disconnect()
  }, [page, status])

  return (
    <div className="feed">
      <div className="counter">{items.length} lessons loaded</div>
      <div className="page">
        {items.map(item => (
          <div className="row" key={item.id}>{item.title}</div>
        ))}
        <div ref={sentinel} className="sentinel">
          {status === 'loading' && 'Loading...'}
          {status === 'end' && 'That is all'}
          {status === 'error' && (
            <button onClick={() => setStatus('idle')}>Retry</button>
          )}
        </div>
      </div>
    </div>
  )
}
