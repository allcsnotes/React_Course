import type { ReactNode } from 'react'
import type { AsyncState } from './states'

interface AsyncViewProps<T> {
  state: AsyncState<T>
  children: (data: T) => ReactNode
}

export function AsyncView<T>({
  state,
  children,
}: AsyncViewProps<T>) {
  switch (state.status) {
    case 'loading':
      return <p className="muted">Loading...</p>
    case 'error':
      return <p className="err">{state.message}</p>
    case 'success':
      return <>{children(state.data)}</>
  }
}
