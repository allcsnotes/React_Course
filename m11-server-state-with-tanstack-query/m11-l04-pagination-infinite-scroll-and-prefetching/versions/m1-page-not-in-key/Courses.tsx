import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getCoursePage } from './api'
import CourseList from './CourseList'
import Pager from './Pager'

export default function Courses() {
  const [page, setPage] = useState(1)
  const {
    data, isPending, isError, isPlaceholderData,
  } = useQuery({
    queryKey: ['courses'],
    queryFn: () => getCoursePage(page),
    placeholderData: keepPreviousData,
  })

  if (isPending) return <p className="note">Loading...</p>
  if (isError) return <p className="bad">Something failed</p>
  return (
    <main>
      <h1>All courses</h1>
      <div className={isPlaceholderData ? 'dim' : ''}>
        <CourseList items={data.items} />
      </div>
      <Pager
        page={page}
        total={data.totalPages}
        onGo={setPage}
        busy={isPlaceholderData}
      />
    </main>
  )
}
