export type Course = {
  slug: string
  title: string
  teacher: string
  level: string
  price: number
  free: boolean
  lessonCount: number
}

export type MyCourse = {
  slug: string
  title: string
  teacher: string
  lessonCount: number
  completedCount: number
}

export type User = {
  id: number
  name: string
  email: string
  role: 'student' | 'instructor' | 'admin'
}

export type CartItem = {
  slug: string
  title: string
  price: number
}
