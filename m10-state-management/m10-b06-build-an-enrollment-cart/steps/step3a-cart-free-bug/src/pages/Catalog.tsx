import { useLoaderData } from 'react-router'
import CourseCard from '../components/CourseCard'
import type { Course } from '../types'

export default function Catalog() {
  const courses = useLoaderData<Course[]>()

  return (
    <>
      <h1>Courses</h1>
      <div className="grid">
        {courses.map(c => (
          <CourseCard key={c.slug} course={c} />
        ))}
      </div>
    </>
  )
}
