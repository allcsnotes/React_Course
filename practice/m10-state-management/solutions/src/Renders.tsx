import { useRef } from 'react'

// Counts how many times the component that contains it has run (lesson M10-L01).
// The count only means "once per draw" because main.tsx has no StrictMode.
export function Renders() {
  const count = useRef(0)
  count.current += 1
  return <span className="renders">times {count.current}</span>
}
