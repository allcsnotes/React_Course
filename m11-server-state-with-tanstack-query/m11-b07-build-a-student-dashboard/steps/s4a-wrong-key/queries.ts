import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { completeLesson, getCourse, getMyCourses } from './api.ts'

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

export function useCompleteLesson(slug: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => completeLesson(slug, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course', slug] })
      queryClient.invalidateQueries({ queryKey: ['my-course'] })
    },
  })
}
