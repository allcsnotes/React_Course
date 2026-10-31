import { lazy, Suspense, useState } from 'react'
import CoursesPage from './CoursesPage.tsx'

const loadDashboard = () => import('./DashboardPage.tsx')
const DashboardPage = lazy(loadDashboard)

export default function App() {
  const [page, setPage] = useState<'courses' | 'dashboard'>('courses')
  return (
    <>
      <header>
        <h1>allcsvideos</h1>
        <button className={'nav' + (page === 'courses' ? ' on' : '')} onClick={() => setPage('courses')}>Courses</button>
        <button
          className={'nav' + (page === 'dashboard' ? ' on' : '')}
          onClick={() => setPage('dashboard')}
          onMouseEnter={loadDashboard}
        >
          Dashboard
        </button>
      </header>
      {page === 'courses' ? (
        <CoursesPage />
      ) : (
        <Suspense fallback={<p className="wait">Loading the dashboard…</p>}>
          <DashboardPage />
        </Suspense>
      )}
    </>
  )
}
