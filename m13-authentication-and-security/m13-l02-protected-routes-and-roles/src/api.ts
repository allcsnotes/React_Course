import { useEffect, useState } from 'react'
import { useAuth } from './auth'

export type State<T> =
  | { status: 'loading' }
  | { status: 'ok'; data: T }
  | { status: 'error'; code: number; message: string }

export function useGet<T>(path: string): State<T> {
  const { token } = useAuth()
  const [state, setState] = useState<State<T>>({ status: 'loading' })

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` }
    fetch(path, { headers }).then(async res => {
      const body = await res.json()
      if (res.ok) return setState({ status: 'ok', data: body })
      const message = body.error
      setState({ status: 'error', code: res.status, message })
    })
  }, [path, token])

  return state
}
