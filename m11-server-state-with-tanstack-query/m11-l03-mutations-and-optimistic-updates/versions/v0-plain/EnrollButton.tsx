import { enroll, type Course } from './api'

export function EnrollButton({ course }: { course: Course }) {
  if (course.enrolled) {
    return <span className="done">Enrolled</span>
  }

  return <button onClick={() => enroll(course.slug)}>Enroll</button>
}
