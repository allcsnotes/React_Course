import { useQuery } from '@tanstack/react-query'
import { getCourses } from './api'

export const useCourses = () =>
  useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
    gcTime: 1000,
  })
