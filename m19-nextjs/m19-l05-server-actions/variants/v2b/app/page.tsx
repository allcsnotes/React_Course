import { Suspense } from 'react'
import { ReviewForm } from '@/components/ReviewForm'
import { readReviews } from '@/lib/reviews'

async function Reviews() {
  const reviews = await readReviews()
  return (
    <div className="card">
      <h2>Reviews ({reviews.length})</h2>
      {reviews.map(r => (
        <div className="rev" key={r.id}>
          <div>
            <b>{r.name}</b>
            <p>{r.text}</p>
          </div>
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
          <ReviewForm />
          <Suspense fallback={<div className="card">Loading reviews…</div>}>
            <Reviews />
          </Suspense>
        </div>
      </main>
    </>
  )
}
