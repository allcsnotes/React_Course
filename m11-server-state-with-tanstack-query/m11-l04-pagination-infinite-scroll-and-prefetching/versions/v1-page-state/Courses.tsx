import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getCoursePage } from './api'
import CourseList from './CourseList'
import Pager from './Pager'

export default function Courses() {
  const [page, setPage] = useState(1)
  const { data, isPending, isError } = useQuery({
    queryKey: ['courses', page],
    queryFn: () => getCoursePage(page),
  })

  if (isPending) return <p className="note">Loading...</p>
  if (isError) return <p className="bad">Something failed</p>
  return (
    <main>
      <h1>All courses</h1>
      <CourseList items={data.items} />
      <Pager page={page} total={data.totalPages} onGo={setPage} />
    </main>
  )
}
