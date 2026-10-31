import { useState } from 'react'

export default function StarRating({ max = 5 }) {
  const [value, setValue] = useState(0)
  const stars = Array.from({ length: max }, (_, k) => k + 1)
  return (
    <div className="stars">
      {stars.map(i => (
        <div key={i} onClick={() => setValue(i)}
          className={i <= value ? 'star on' : 'star'}>
          ★
        </div>
      ))}
    </div>
  )
}
