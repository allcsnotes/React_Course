import { useQuery } from '@tanstack/react-query'
import { getCourse, getMyCourses } from './api.ts'

export function useMyCourses() {
  return useQuery({
    queryKey: ['my-courses'],
    queryFn: getMyCourses,
  })
}

export function useCourse(slug: string) {
  return useQuery({
    queryKey: ['course', slug],
    queryFn: () => getCourse(slug),
  })
}
