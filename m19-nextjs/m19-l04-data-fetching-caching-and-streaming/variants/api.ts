import { cacheLife } from 'next/cache'

export type Course = { slug: string; title: string; teacher: string; price: number }
export type Review = { who: string; stars: number; text: string }

const API = 'http://localhost:8194/api'

export async function getCourses(): Promise<Course[]> {
  'use cache'
  cacheLife('minutes')
  const res = await fetch(`${API}/courses`)
  return res.json()
}

export async function getReviews(slug: string): Promise<Review[]> {
  const res = await fetch(`${API}/courses/${slug}/reviews`)
  return res.json()
}

export async function slow(part: string) {
  const res = await fetch(`${API}/courses?ms=500&part=${part}`)
  return res.json()
}
