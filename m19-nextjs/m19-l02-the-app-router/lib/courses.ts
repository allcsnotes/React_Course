export type Course = { slug: string; title: string; teacher: string; level: string; price: number; lessonCount: number }

const API = 'http://localhost:8192/api'

export async function getCourses(): Promise<Course[]> {
  const res = await fetch(`${API}/courses`)
  if (!res.ok) throw new Error('could not load the courses')
  return res.json()
}

export async function getCourse(slug: string): Promise<Course | null> {
  const res = await fetch(`${API}/courses/${slug}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error('the course service is down')
  return res.json()
}
