import { memo } from 'react'
import type { Course } from './data.ts'
import CourseCard from './CourseCard.tsx'
import { useRenderCount } from './useRenderCount.ts'

type Props = { courses: Course[] }

function CourseList({ courses }: Props) {
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

export default memo(CourseList)
