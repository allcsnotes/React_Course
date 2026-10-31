import { useSearchParams } from 'react-router'
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import { coursesQuery } from './queries'
import CourseList from './CourseList'
import Pager from './Pager'

export default function Courses() {
  const [params, setParams] = useSearchParams()
  const queryClient = useQueryClient()
  const page = Math.max(1, Number(params.get('page')) || 1)
  const goTo = (p: number) => setParams({ page: String(p) })
  const prefetchNext = () =>
    queryClient.prefetchQuery(coursesQuery(page + 1))
  const {
    data, isPending, isError, isPlaceholderData,
  } = useQuery({
    ...coursesQuery(page),
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
        onGo={goTo}
        busy={isPlaceholderData}
        onPeek={prefetchNext}
      />
    </main>
  )
}
