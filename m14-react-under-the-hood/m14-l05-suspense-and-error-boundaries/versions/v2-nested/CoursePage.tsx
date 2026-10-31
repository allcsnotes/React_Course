import { Suspense, use } from 'react'
import { COURSE, load } from './api.ts'
import type { Course } from './api.ts'
import { LessonList } from './LessonList.tsx'
import { Reviews } from './Reviews.tsx'

export function CoursePage() {
  const course = use(load<Course>(COURSE))
  return (
    <>
      <h2 className="title">{course.title} · by {course.teacher}</h2>
      <main>
        <section>
          <h2>Lessons</h2>
          <Suspense fallback={<p className="wait">Loading lessons…</p>}>
            <LessonList />
          </Suspense>
        </section>
        <section>
          <h2>Reviews</h2>
          <Suspense fallback={<p className="wait">Loading reviews…</p>}>
            <Reviews />
          </Suspense>
        </section>
      </main>
    </>
  )
}
