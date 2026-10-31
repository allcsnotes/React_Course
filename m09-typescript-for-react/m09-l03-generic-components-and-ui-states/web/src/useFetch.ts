import { useEffect, useState } from 'react'
import type { AsyncState } from './states'

export function useFetch<T>(url: string): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    status: 'loading',
  })

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      setState({ status: 'loading' })
      try {
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) throw new Error(`Server answered ${res.status}`)
        const data: T = await res.json()
        setState({ status: 'success', data })
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return
        }
        const message =
          err instanceof Error ? err.message : 'Unknown error'
        setState({ status: 'error', message })
      }
    }
    load()
    return () => controller.abort()
  }, [url])

  return state
}
