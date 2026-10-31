import { useState } from 'react'

type QuantityProps = { start?: number }

export function Quantity({ start = 1 }: QuantityProps) {
  const [n, setN] = useState(start)
  return (
    <div className="qty">
      <button onClick={() => setN(n - 1)}>-</button>
      <span>{n}</span>
      <button onClick={() => setN(n + 1)}>+</button>
    </div>
  )
}
