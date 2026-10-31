import { Suspense } from 'react'
import { deleteReview } from './actions'
import { ReviewForm } from '@/components/ReviewForm'
import { readReviews } from '@/lib/reviews'
import { isAdmin } from '@/lib/session'

async function Reviews() {
  const [reviews, admin] = await Promise.all([readReviews(), isAdmin()])
  return (
    <div className="card">
      <h2>Reviews ({reviews.length})</h2>
      {reviews.map(r => (
        <div className="rev" key={r.id}>
          <div>
            <b>{r.name}</b>
            <p>{r.text}</p>
          </div>
          <form action={deleteReview}>
            <input type="hidden" name="id" value={r.id} />
            <button className="del" disabled={!admin}>Delete</button>
          </form>
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
