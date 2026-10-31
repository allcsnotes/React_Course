import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { completeLesson, getCourse, getMyCourses } from './api.ts'
import { markDone } from './progress.ts'
import type { CourseDetail } from './schema.ts'

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
  const qc = useQueryClient()
  const courseKey = ['course', slug]
  return useMutation({
    mutationFn: (id: number) => completeLesson(slug, id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: courseKey })
      const course = qc.getQueryData<CourseDetail>(courseKey)
      if (course) qc.setQueryData(courseKey, markDone(course, id))
      return { course }
    },
    onError: (_error, _id, saved) => {
      qc.setQueryData(courseKey, saved?.course)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: courseKey })
      qc.invalidateQueries({ queryKey: ['my-courses'] })
    },
  })
}
