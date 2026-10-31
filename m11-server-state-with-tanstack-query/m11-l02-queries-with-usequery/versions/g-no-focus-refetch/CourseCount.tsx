import { useCourses } from './queries'

export default function CourseCount() {
  const { data, isFetching } = useCourses()
  return (
    <span className="badge">
      {data ? `${data.length} courses` : '...'}
      {isFetching && <span className="pill">updating</span>}
    </span>
  )
}
