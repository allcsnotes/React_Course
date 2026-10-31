import { useState } from 'react'

function App() {
  const [review, setReview] = useState('')

  return (
    <div className="page">
      <label htmlFor="review">Write a review</label>
      <textarea
        id="review"
        value={review}
        onChange={e => setReview(e.target.value)}
      />
      <p className="dim">
        {review.length} / 40 characters
      </p>
    </div>
  )
}

export default App
