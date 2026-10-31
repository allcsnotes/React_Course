import { Component, type ReactNode } from 'react'

// React still needs a class to catch errors while drawing.
export class ErrorBoundary extends Component<{ children: ReactNode }, { message: string | null }> {
  state: { message: string | null } = { message: null }

  static getDerivedStateFromError(error: Error) {
    return { message: error.message }
  }

  render() {
    if (this.state.message !== null) {
      return <p className="error">Caught: {this.state.message}</p>
    }
    return this.props.children
  }
}
