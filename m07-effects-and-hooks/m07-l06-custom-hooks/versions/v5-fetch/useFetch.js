import { useState, useEffect } from 'react'

export function useFetch(url) {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading')

    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) {
          throw new Error(
            'Server answered ' + res.status
          )
        }
        return res.json()
      })
      .then(json => {
        setData(json)
        setStatus('success')
      })
      .catch(err => {
        if (err.name === 'AbortError') return
        setError(err.message)
        setStatus('error')
      })

    return () => controller.abort()
  }, [url])

  return { data, status, error }
}
