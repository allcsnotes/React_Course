import { CourseList } from './CourseList'
import { LessonList } from './LessonList'
import { courses, lessons } from './data'

export default function App() {
  return (
    <main>
      <section>
        <h2>Courses</h2>
        <CourseList items={courses} />
      </section>
      <section>
        <h2>Lessons</h2>
        <LessonList items={lessons} />
      </section>
    </main>
  )
}
