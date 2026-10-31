export type Course = {
  slug: string
  title: string
  teacher: string
  level: 'beginner' | 'intermediate' | 'advanced'
  price: number
  free: boolean
}
export type Teacher = { name: string; courses: number }
