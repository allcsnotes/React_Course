import { useRef } from 'react'

export function RenderCount() {
  const count = useRef(0)
  count.current += 1
  return <span className="renders">renders {count.current}</span>
}
