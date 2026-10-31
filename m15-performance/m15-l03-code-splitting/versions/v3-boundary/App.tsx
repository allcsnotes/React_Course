import { lazy, Suspense, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import CoursesPage from './CoursesPage.tsx'

const DashboardPage = lazy(() => import('./DashboardPage.tsx'))

function Oops() {
  return (
    <div className="oops" role="alert">
      <p>The dashboard could not be loaded.</p>
      <button className="try" onClick={() => window.location.reload()}>
        Reload the page
      </button>
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState<'courses' | 'dashboard'>('courses')
  return (
    <>
      <header>
        <h1>allcsvideos</h1>
        <button className={'nav' + (page === 'courses' ? ' on' : '')} onClick={() => setPage('courses')}>Courses</button>
        <button className={'nav' + (page === 'dashboard' ? ' on' : '')} onClick={() => setPage('dashboard')}>Dashboard</button>
      </header>
      {page === 'courses' ? (
        <CoursesPage />
      ) : (
        <ErrorBoundary FallbackComponent={Oops}>
          <Suspense fallback={<p className="wait">Loading…</p>}>
            <DashboardPage />
          </Suspense>
        </ErrorBoundary>
      )}
    </>
  )
}
