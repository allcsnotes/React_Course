import { useInfiniteQuery } from '@tanstack/react-query'
import { getCoursePage } from './api'
import CourseList from './CourseList'
import { useSentinel } from './useSentinel'

export default function Courses() {
  const {
    data, isPending, isError,
    fetchNextPage, hasNextPage, isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['courses', 'infinite'],
    queryFn: ({ pageParam }) => getCoursePage(pageParam),
    initialPageParam: 1,
    getNextPageParam: last => last.nextPage,
  })
  const sentinel = useSentinel(
    fetchNextPage,
    hasNextPage && !isFetchingNextPage,
  )

  if (isPending) return <p className="note">Loading...</p>
  if (isError) return <p className="bad">Something failed</p>
  const items = data.pages.flatMap(p => p.items)
  return (
    <main>
      <h1>All courses ({items.length} of {data.pages[0].total})</h1>
      <CourseList items={items} />
      <div ref={sentinel} className="sentinel">
        {isFetchingNextPage ? 'Loading more...'
          : hasNextPage ? 'scroll for more' : 'That is all'}
      </div>
    </main>
  )
}
