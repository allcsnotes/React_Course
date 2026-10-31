export type Course = {
  id: number
  title: string
  instructor: string
  category: string
  level: string
  hours: number
  rating: number
  students: number
  price: number
}

export async function fetchCourses(): Promise<Course[]> {
  const res = await fetch('/api/courses')
  if (!res.ok) throw new Error('Could not load the courses')
  return res.json()
}
