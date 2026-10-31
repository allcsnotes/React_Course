import { onCLS, onINP, onLCP, type Metric } from 'web-vitals'

const COLLECTOR = 'http://localhost:8213/collect'
const RELEASE = import.meta.env.VITE_RELEASE ?? 'dev'

function send(event: object) {
  const body = JSON.stringify({ ...event, release: RELEASE, at: Date.now() })
  navigator.sendBeacon(COLLECTOR, body)
}

export function report(kind: string, error: Error, extra = '') {
  send({ kind, message: error.message, stack: error.stack, extra })
}

export function startMonitor() {
  window.addEventListener('error', (e) => {
    report('window', e.error ?? new Error(e.message))
  })
  const vital = (m: Metric) => {
    send({ kind: 'vital', name: m.name, value: m.value, rating: m.rating })
  }
  onLCP(vital)
  onINP(vital)
  onCLS(vital)
}
