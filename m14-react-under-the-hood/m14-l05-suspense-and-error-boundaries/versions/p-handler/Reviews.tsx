import { use } from 'react'
import { REVIEWS, load } from './api.ts'
import type { Review } from './api.ts'

export function Reviews() {
  const reviews = use(load<Review[]>(REVIEWS))

  function report() {
    throw new Error('Report failed')
  }

  return (
    <ul>
      {reviews.map(r => (
        <li className="rv" key={r.id}>
          <b>{r.author.name}</b> {'★'.repeat(r.stars)}
          <p>{r.text}</p>
          <button className="rep" onClick={report}>Report</button>
        </li>
      ))}
    </ul>
  )
}
