import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

type Props = { fallback: ReactNode; children: ReactNode }
type State = { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const where = info.componentStack?.split('\n')[1]
    console.log('reported:', error.message, where)
  }

  render() {
    if (this.state.error) return this.props.fallback
    return this.props.children
  }
}
