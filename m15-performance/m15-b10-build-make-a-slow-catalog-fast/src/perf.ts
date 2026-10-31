import type { ProfilerOnRenderCallback } from 'react'

// Measuring helpers: they only write numbers into window.__perf so a script can read them.
type Perf = {
  renders: Record<string, number>
  commits: { id: string; phase: string; ms: number }[]
  timings: Record<string, number[]>
}
declare global {
  interface Window {
    __perf: Perf
  }
}
window.__perf ??= { renders: {}, commits: [], timings: {} }

export const countRender = (name: string) => {
  window.__perf.renders[name] = (window.__perf.renders[name] ?? 0) + 1
}

export const onRender: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
) => {
  window.__perf.commits.push({ id, phase, ms: actualDuration })
}

export function timed<T>(name: string, work: () => T): T {
  const start = performance.now()
  const result = work()
  ;(window.__perf.timings[name] ??= []).push(performance.now() - start)
  return result
}
