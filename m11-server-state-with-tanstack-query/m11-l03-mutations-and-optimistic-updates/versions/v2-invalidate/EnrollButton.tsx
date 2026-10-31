import { useMutation, useQueryClient } from '@tanstack/react-query'
import { enroll, type Course } from './api'

export function EnrollButton({ course }: { course: Course }) {
  const queryClient = useQueryClient()
  const enrollment = useMutation({
    mutationFn: enroll,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['courses'] }),
  })

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
