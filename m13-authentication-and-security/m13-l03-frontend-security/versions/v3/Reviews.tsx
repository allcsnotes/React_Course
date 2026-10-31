import DOMPurify from 'dompurify'
import { useEffect, useState } from 'react'
import type { Review } from './types'

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    fetch('/api/reviews').then(r => r.json()).then(setReviews)
  }, [])

  return (
    <ul className="grid">
      {reviews.map((r, i) => (
        <li key={i} className="card">
          <h2>{r.author}</h2>
          <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(r.text) }} />
        </li>
      ))}
    </ul>
  )
}
