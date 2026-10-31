import { useRef } from 'react'

export function useRenderCount() {
  const n = useRef(0)
  n.current += 1
  return n.current
}
