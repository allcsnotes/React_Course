import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { completeLesson, getCourse, getMyCourses } from './api.ts'
import { addOne, markDone } from './progress.ts'
import type { CourseDetail, MyCourse } from './schema.ts'

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
      await qc.cancelQueries({ queryKey: ['my-courses'] })
      const course = qc.getQueryData<CourseDetail>(courseKey)
      const courses = qc.getQueryData<MyCourse[]>(['my-courses'])
      if (course) qc.setQueryData(courseKey, markDone(course, id))
      if (courses) qc.setQueryData(['my-courses'], addOne(courses, slug))
      return { course, courses }
    },
    onError: (_error, _id, saved) => {
      qc.setQueryData(courseKey, saved?.course)
      qc.setQueryData(['my-courses'], saved?.courses)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: courseKey })
      qc.invalidateQueries({ queryKey: ['my-courses'] })
    },
  })
}
