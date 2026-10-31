import { useEffect, useState } from 'react'
import { getCourses } from './api'
import CourseCards from './CourseCards'
import type { Course } from './schema'

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([])
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    getCourses()
      .then(c => { setCourses(c); setStatus('ready') })
      .catch(e => { setMessage(e.message); setStatus('error') })
  }, [])

  if (status === 'loading') return <p className="note">Loading...</p>
  if (status === 'error') return <p className="bad">{message}</p>
  return <CourseCards courses={courses} />
}
