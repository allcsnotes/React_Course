import { cacheLife } from 'next/cache'

const API = process.env.API_URL ?? 'http://localhost:8190'

export type Course = {
  slug: string
  title: string
  teacher: string
  level: string
  price: number
  free: boolean
  summary: string
  lessonCount: number
}
export type CourseDetail = Course & { lessons: string[] }
export type Review = { name: string; stars: number; text: string }

export async function getCourses(): Promise<Course[]> {
  'use cache'
  cacheLife('hours')
  const res = await fetch(`${API}/api/courses`)
  return res.json()
}

export async function getCourse(slug: string): Promise<CourseDetail | null> {
  'use cache'
  cacheLife('hours')
  const res = await fetch(`${API}/api/courses/${slug}`)
  return res.ok ? res.json() : null
}

export async function getReviews(slug: string): Promise<Review[]> {
  const res = await fetch(`${API}/api/courses/${slug}/reviews`)
  return res.json()
}
