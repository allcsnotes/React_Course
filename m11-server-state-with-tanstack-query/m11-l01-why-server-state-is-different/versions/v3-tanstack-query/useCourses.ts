import { useQuery } from '@tanstack/react-query'
import type { Course } from './types'

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async (): Promise<Course[]> => (await fetch('/api/courses')).json(),
  })
}
