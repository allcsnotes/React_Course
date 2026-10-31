import type { Course } from './types'

export async function getCourses(): Promise<Course[]> {
  const res = await fetch('/api/courses')
  if (!res.ok) throw new Error(`Server answered ${res.status}`)
  return (await res.json()) as Course[]
}
