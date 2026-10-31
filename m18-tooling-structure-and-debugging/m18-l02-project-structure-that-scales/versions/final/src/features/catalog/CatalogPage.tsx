import { useQuery } from '@tanstack/react-query'
import CourseCard from './CourseCard'
import { getCourses } from './api'

export default function CatalogPage() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  })

  if (isPending) return <p>Loading...</p>
  if (isError) {
    return (
      <p role="alert" className="err">
        Could not load the courses
      </p>
    )
  }

  return (
    <>
      <h1>Courses</h1>
      <div className="grid">
        {data.map((c) => (
          <CourseCard key={c.slug} course={c} />
        ))}
      </div>
    </>
  )
}
