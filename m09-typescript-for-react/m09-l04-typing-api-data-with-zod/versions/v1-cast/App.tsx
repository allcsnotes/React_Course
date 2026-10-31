import { useEffect, useState } from 'react'
import { getCourses } from './api'
import type { Course } from './types'

type Status = 'loading' | 'error' | 'ready'

export default function App() {
  const [courses, setCourses] = useState<Course[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    getCourses()
      .then(list => { setCourses(list); setStatus('ready') })
      .catch((err: Error) => { setMessage(err.message); setStatus('error') })
  }, [])

  if (status === 'loading') return <p className="note">Loading...</p>
  if (status === 'error') return (
    <main>
      <h1>All courses</h1>
      <p className="bad">{message}</p>
    </main>
  )
  return (
    <main>
      <h1>All courses</h1>
      <ul className="grid">
        {courses.map(c => (
          <li key={c.slug} className="card">
            <h2>{c.title}</h2>
            <p>by {c.teacher}</p>
            <p>Total with the Rs 50 fee: Rs {c.price + 50}</p>
          </li>
        ))}
      </ul>
    </main>
  )
}
