import { Suspense } from 'react'
import { ErrorBoundary, getErrorMessage } from 'react-error-boundary'
import type { FallbackProps } from 'react-error-boundary'
import { REVIEWS, forget } from './api.ts'
import { Header } from './Header.tsx'
import { LessonList } from './LessonList.tsx'
import { Reviews } from './Reviews.tsx'

function ReviewsError({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="oops">
      <p>Reviews could not be shown: {getErrorMessage(error)}</p>
      <button className="try" onClick={resetErrorBoundary}>
        Try again
      </button>
    </div>
  )
}

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
          <ErrorBoundary
            FallbackComponent={ReviewsError}
            onReset={() => forget(REVIEWS)}
          >
            <Suspense fallback={<p className="wait">Loading reviews…</p>}>
              <Reviews />
            </Suspense>
          </ErrorBoundary>
        </section>
      </main>
    </>
  )
}
