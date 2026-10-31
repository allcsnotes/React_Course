import { courses } from './data.ts'
import CourseCard from './CourseCard.tsx'
import { ThemeContext } from './ThemeContext.tsx'

export default function CourseList() {
  return (
    <div className="main">
      <h1>Courses</h1>
      <div className="grid">
        <CourseCard course={courses[0]} />
        <ThemeContext
          value={{ theme: 'dark', toggle: () => {} }}
        >
          <CourseCard course={courses[1]} />
        </ThemeContext>
        <CourseCard course={courses[2]} />
      </div>
    </div>
  )
}
