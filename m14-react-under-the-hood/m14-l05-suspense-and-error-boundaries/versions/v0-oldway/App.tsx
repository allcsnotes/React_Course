import { useEffect, useState } from 'react'
import { Header } from './Header.tsx'
import { LESSONS, REVIEWS, getJson } from './api.ts'
import type { Lesson, Review } from './api.ts'

export default function App() {
  const [lessons, setLessons] = useState<Lesson[] | null>(null)
  const [reviews, setReviews] = useState<Review[] | null>(null)

  useEffect(() => {
    Promise.all([getJson<Lesson[]>(LESSONS), getJson<Review[]>(REVIEWS)]).then(([l, r]) => {
      setLessons(l)
      setReviews(r)
    })
  }, [])

  if (lessons === null || reviews === null) {
    return (
      <>
        <Header />
        <p className="wait big">Loading the page…</p>
      </>
    )
  }
  return (
    <>
      <Header />
      <main>
        <section>
          <h2>Lessons</h2>
          <ul>
            {lessons.map(l => (
              <li key={l.id}>
                <span>{l.title}</span>
                <span>{l.minutes} min</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Reviews</h2>
          <ul>
            {reviews.map(r => (
              <li className="rv" key={r.id}>
                <b>{r.author.name}</b> {'★'.repeat(r.stars)}
                <p>{r.text}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  )
}
