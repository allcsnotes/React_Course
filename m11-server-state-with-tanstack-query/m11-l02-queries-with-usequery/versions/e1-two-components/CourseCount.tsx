import { useQuery } from '@tanstack/react-query'
import { getCourses } from './api'

export default function CourseCount() {
  const { data, isFetching } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  })
  return (
    <span className="badge">
      {data ? `${data.length} courses` : '...'}
      {isFetching && <span className="pill">updating</span>}
    </span>
  )
}
