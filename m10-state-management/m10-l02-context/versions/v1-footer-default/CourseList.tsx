import { courses } from './data.ts'
import CourseCard from './CourseCard.tsx'

export default function CourseList() {
  return (
    <div className="main">
      <h1>Courses</h1>
      <div className="grid">
        {courses.map((c) => (
          <CourseCard key={c.slug} course={c} />
        ))}
      </div>
    </div>
  )
}
