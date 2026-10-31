import { Component, type ReactNode } from 'react'
import { report } from './monitor.ts'

type Props = { children: ReactNode }

export class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    report('render', error, info.componentStack ?? '')
  }

  render() {
    if (this.state.failed) {
      return <p className="oops">Something went wrong. We have been told.</p>
    }
    return this.props.children
  }
}
