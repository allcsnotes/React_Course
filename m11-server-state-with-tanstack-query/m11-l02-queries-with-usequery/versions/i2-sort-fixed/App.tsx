import { useState } from 'react'
import CourseCount from './CourseCount'
import CourseList from './CourseList'

export default function App() {
  const [page, setPage] = useState('courses')

  return (
    <main>
      <nav>
        <button className={page === 'courses' ? 'on' : ''} onClick={() => setPage('courses')}>Courses</button>
        <button className={page === 'about' ? 'on' : ''} onClick={() => setPage('about')}>About</button>
        {page === 'courses' && <CourseCount />}
      </nav>
      {page === 'courses' ? <CourseList /> : <p className="note">allcsvideos: courses for developers.</p>}
    </main>
  )
}
