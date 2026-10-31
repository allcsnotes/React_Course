import { lazy, Suspense, useState } from 'react'
import CoursesPage from './CoursesPage.tsx'

const DashboardPage = lazy(() => import('./DashboardPage.tsx'))

export default function App() {
  const [page, setPage] = useState<'courses' | 'dashboard'>('courses')
  const [user, setUser] = useState<string | null>(null)
  return (
    <>
      <header>
        <h1>allcsvideos</h1>
        <button className={'nav' + (page === 'courses' ? ' on' : '')} onClick={() => setPage('courses')}>Courses</button>
        <button className={'nav' + (page === 'dashboard' ? ' on' : '')} onClick={() => setPage('dashboard')}>Dashboard</button>
        <button className="nav" onClick={() => setUser(user ? null : 'Asha')}>{user ? 'Hi, ' + user : 'Sign in'}</button>
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
