import { Suspense } from 'react'
import { Header } from './Header.tsx'
import { LessonList } from './LessonList.tsx'
import { Reviews } from './Reviews.tsx'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <section>
          <h2>Lessons</h2>
          <Suspense fallback={<p className="wait">Loading lessons…</p>}>
            <LessonList />
          </Suspense>
        </section>
        <section>
          <h2>Reviews</h2>
          <Suspense fallback={<p className="wait">Loading reviews…</p>}>
            <Reviews />
          </Suspense>
        </section>
      </main>
    </>
  )
}
