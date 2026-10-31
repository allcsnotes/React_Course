import { useQuery } from '@tanstack/react-query'
import { getCourses } from './api'
import CourseCards from './CourseCards'

export default function CourseList() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  })

  if (isPending) return <p className="note">Loading...</p>
  if (isError) return <p className="bad">{error.message}</p>
  return <CourseCards courses={data} />
}
