import { Suspense } from 'react'
import { ErrorBoundary } from './ErrorBoundary.tsx'
import { Header } from './Header.tsx'
import { LessonList } from './LessonList.tsx'
import { Reviews } from './Reviews.tsx'

const down = <p className="oops">Reviews could not be shown.</p>

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
          <ErrorBoundary fallback={down}>
            <Suspense fallback={<p className="wait">Loading reviews…</p>}>
              <Reviews />
            </Suspense>
          </ErrorBoundary>
        </section>
      </main>
    </>
  )
}
