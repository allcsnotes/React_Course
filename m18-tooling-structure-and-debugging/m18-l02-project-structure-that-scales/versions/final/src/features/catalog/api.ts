import { request } from '@/shared/api/client'
import type { Course } from './types'

export const getCourses = () => request<Course[]>('/api/courses')
