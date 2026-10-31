import { useEnroll } from './useEnroll'
import type { Course } from './api'

export function EnrollButton({ course }: { course: Course }) {
  const enrollment = useEnroll()

  if (course.enrolled) {
    return <span className="done">Enrolled</span>
  }

  return (
    <div>
      <button
        disabled={enrollment.isPending}
        onClick={() => enrollment.mutate(course.slug)}
      >
        {enrollment.isPending ? 'Enrolling…' : 'Enroll'}
      </button>
      <p className="error">{enrollment.error?.message}</p>
    </div>
  )
}
