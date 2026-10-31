import { useCourses } from './CoursesProvider'

export function DealBanner() {
  const courses = useCourses()
  if (courses.length === 0) return <p className="deal">Loading the deal...</p>
  const first = courses[0]
  return <p className="deal">Deal of the day: {first.title}, Rs {first.price}</p>
}
