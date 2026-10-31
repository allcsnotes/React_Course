import { Suspense, createContext, use } from 'react'
import { getCourses, type Course } from './api'

const coursesPromise = getCourses()

type Props = { promise: Promise<Course[]> }

function CourseList({ promise }: Props) {
  const courses = use(promise)
  return (
    <ul className="grid">
      {courses.map((c) => (
        <li className="card" key={c.slug}>
          <h2>{c.title}</h2>
          <p>by {c.teacher} · <Price course={c} /></p>
        </li>
      ))}
    </ul>
  )
}

export function Courses() {
  return (
    <Suspense fallback={<p className="note">Loading courses…</p>}>
      <CourseList promise={coursesPromise} />
    </Suspense>
  )
}

const CurrencyContext = createContext('Rs')

function Price({ course }: { course: Course }) {
  if (course.price === 0) return <span>Free</span>
  const currency = use(CurrencyContext)
  return <span>{currency} {course.price}</span>
}
