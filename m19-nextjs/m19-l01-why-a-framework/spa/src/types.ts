export type CourseData = {
  slug: string
  title: string
  teacher: string
  level: string
  price: number
  rating: number
  free: boolean
}
export const API = 'http://localhost:8191/api/courses'
