import { useQuery } from '@tanstack/react-query'
import { getAllCourses } from './api'
import CourseList from './CourseList'

export default function Courses() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['courses'],
    queryFn: getAllCourses,
  })

  if (isPending) return <p className="note">Loading...</p>
  if (isError) return <p className="bad">Could not load the courses.</p>
  return (
    <main>
      <h1>All courses ({data.length})</h1>
      <CourseList items={data} />
    </main>
  )
}
