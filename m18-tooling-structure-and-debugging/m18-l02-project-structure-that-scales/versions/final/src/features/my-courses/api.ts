import { request } from '@/shared/api/client'

export type MyCourse = {
  slug: string
  title: string
  teacher: string
  lessonCount: number
  completedCount: number
}

export const getMyCourses = () =>
  request<MyCourse[]>('/api/me/courses')
