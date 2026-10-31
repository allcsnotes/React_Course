import { useState } from 'react'

type QuantityProps = { start?: number }

export function Quantity({ start }: QuantityProps) {
  const [n, setN] = useState(start || 1)
  return (
    <div className="qty">
      <button onClick={() => setN(n - 1)}>-</button>
      <span>{n}</span>
      <button onClick={() => setN(n + 1)}>+</button>
    </div>
  )
}
