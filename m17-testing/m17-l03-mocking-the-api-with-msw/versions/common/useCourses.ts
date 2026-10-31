import { useEffect, useState } from 'react'
import { API, type Course } from './api.ts'

type Status = 'loading' | 'error' | 'success'

export function useCourses() {
  const [status, setStatus] = useState<Status>('loading')
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    fetch(`${API}/api/courses`)
      .then((res) => {
        if (!res.ok) throw new Error('bad status')
        return res.json()
      })
      .then((data: Course[]) => {
        setCourses(data)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
  }, [])

  return { status, courses }
}
