import { useQuery } from '@tanstack/react-query'
import { getMyCourses } from './api.ts'

export function useMyCourses() {
  return useQuery({
    queryKey: ['my-courses'],
    queryFn: getMyCourses,
  })
}
