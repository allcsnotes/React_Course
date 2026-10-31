import { useCourses } from './queries'
import CourseCards from './CourseCards'

export default function CourseList() {
  const { data, isPending, isError, error, refetch } = useCourses()

  if (isPending) return <p className="note">Loading...</p>
  if (isError) return (
    <>
      <p className="bad">{error.message}</p>
      <p><button onClick={() => refetch()}>Try again</button></p>
    </>
  )
  return <CourseCards courses={data} />
}
