import { useEffect, useState } from 'react'

type Status = 'loading' | 'success' | 'error'

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading')
    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error('Server answered ' + res.status)
        return res.json()
      })
      .then(json => { setData(json); setStatus('success') })
      .catch(err => {
        if (err.name === 'AbortError') return
        setError(err.message)
        setStatus('error')
      })
    return () => controller.abort()
  }, [url])

  return { data, status, error }
}
