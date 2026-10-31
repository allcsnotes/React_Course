import { courses } from './data.ts'
import CourseCard from './CourseCard.tsx'
import { useRenderCount } from './useRenderCount.ts'

export default function CourseList() {
  const n = useRenderCount()
  return (
    <div className="main">
      <h1>Courses <span className="cnt">list {n}</span></h1>
      <div className="grid">
        {courses.map((c) => (
          <CourseCard key={c.slug} course={c} />
        ))}
      </div>
    </div>
  )
}
