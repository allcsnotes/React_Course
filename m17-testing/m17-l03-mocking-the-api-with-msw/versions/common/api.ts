export const API = 'http://localhost:8173'

export type Course = {
  slug: string
  title: string
  teacher: string
  level: string
  price: number
  free: boolean
  lessonCount: number
}
