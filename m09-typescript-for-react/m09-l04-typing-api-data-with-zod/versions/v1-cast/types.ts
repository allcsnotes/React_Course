export interface Course {
  slug: string
  title: string
  teacher: string
  level: 'beginner' | 'intermediate' | 'advanced'
  price: number
  free: boolean
  lessonCount: number
}
