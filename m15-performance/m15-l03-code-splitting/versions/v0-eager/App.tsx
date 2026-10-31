import { useState } from 'react'
import CoursesPage from './CoursesPage.tsx'
import DashboardPage from './DashboardPage.tsx'

export default function App() {
  const [page, setPage] = useState<'courses' | 'dashboard'>('courses')
  return (
    <>
      <header>
        <h1>allcsvideos</h1>
        <button className={'nav' + (page === 'courses' ? ' on' : '')} onClick={() => setPage('courses')}>Courses</button>
        <button className={'nav' + (page === 'dashboard' ? ' on' : '')} onClick={() => setPage('dashboard')}>Dashboard</button>
      </header>
      {page === 'courses' ? <CoursesPage /> : <DashboardPage />}
    </>
  )
}
