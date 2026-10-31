'use client'

import { useState } from 'react'

export default function EnrollButton({ price }: { price: number }) {
  const [done, setDone] = useState(false)
  const label = price === 0 ? 'Enroll for free' : `Enroll for Rs ${price}`
  return (
    <button className="btn" onClick={() => setDone(true)} disabled={done}>
      {done ? 'You are in!' : label}
    </button>
  )
}
