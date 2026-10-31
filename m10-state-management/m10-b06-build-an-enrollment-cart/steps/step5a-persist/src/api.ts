import type { Course } from './types'

export async function getCourses(): Promise<Course[]> {
  const res = await fetch('/api/courses')
  return res.json()
}

export async function getCourse(slug: string): Promise<Course> {
  const res = await fetch(`/api/courses/${slug}`)
  if (!res.ok) throw new Response('Not found', { status: 404 })
  return res.json()
}
