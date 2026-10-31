import { Suspense } from 'react'
import { CoursePage } from './CoursePage.tsx'
import { Header } from './Header.tsx'

export default function App() {
  return (
    <>
      <Header />
      <Suspense fallback={<p className="wait big">Loading the course…</p>}>
        <CoursePage />
      </Suspense>
    </>
  )
}
