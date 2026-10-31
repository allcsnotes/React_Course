import { useRef } from 'react'

// counts how many times the component that calls it has rendered
export function useRenders() {
  const count = useRef(0)
  count.current += 1
  return count.current
}
