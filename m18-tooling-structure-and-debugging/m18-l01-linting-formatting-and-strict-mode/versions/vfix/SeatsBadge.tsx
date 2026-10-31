import { useState } from 'react'

export function SeatsBadge({ seats }: { seats: number }) {
  const [shown, setShown] = useState(true)
  if (seats === 0) {
    return <span className="badge">Sold out</span>
  }
  return (
    <button onClick={() => setShown(!shown)}>
      {shown ? `${seats} seats left` : 'Show seats'}
    </button>
  )
}
