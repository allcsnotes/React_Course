import { useState } from 'react'

export function SeatsBadge({ seats }: { seats: number }) {
  if (seats === 0) {
    return <span className="badge">Sold out</span>
  }
  const [shown, setShown] = useState(true)
  return (
    <button onClick={() => setShown(!shown)}>
      {shown ? `${seats} seats left` : 'Show seats'}
    </button>
  )
}
