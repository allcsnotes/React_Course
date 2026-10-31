import { Suspense } from 'react'
import { postReview } from './actions'
import { readReviews } from '@/lib/reviews'

async function Reviews() {
  const reviews = await readReviews()
  return (
    <div className="card">
      <h2>Reviews ({reviews.length})</h2>
      {reviews.map(r => (
        <div className="rev" key={r.id}>
          <b>{r.name}</b>
          <p>{r.text}</p>
        </div>
      ))}
    </div>
  )
}

export default function Page() {
  return (
    <>
      <div className="top">allcs<span>videos</span></div>
      <main>
        <h1>React for Beginners</h1>
        <div className="grid">
          <form action={postReview} className="card">
            <h2>Write a review</h2>
            <label htmlFor="name">Your name</label>
            <input id="name" name="name" required />
            <label htmlFor="text">Your review</label>
            <textarea id="text" name="text" required />
            <button type="submit">Post review</button>
          </form>
          <Suspense fallback={<div className="card">Loading reviews…</div>}>
            <Reviews />
          </Suspense>
        </div>
      </main>
    </>
  )
}
