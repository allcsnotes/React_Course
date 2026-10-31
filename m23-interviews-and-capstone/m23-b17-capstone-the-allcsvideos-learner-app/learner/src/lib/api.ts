import { cacheLife } from 'next/cache'
import { Course, CourseDetail, Progress } from '@/lib/schemas'

const API = process.env.API_URL ?? 'http://localhost:8247'

export async function getCourses(q = '') {
  const url = `${API}/api/courses?q=${encodeURIComponent(q)}`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`catalog failed: ${res.status}`)
  return Course.array().parse(await res.json())
}

export async function getCourse(slug: string) {
  'use cache'
  cacheLife('minutes')
  const res = await fetch(`${API}/api/courses/${slug}`)
  if (!res.ok) return null
  return CourseDetail.parse(await res.json())
}

export async function getProgress(userId: string) {
  const res = await fetch(`${API}/api/progress/${userId}`, { cache: 'no-store' })
  return Progress.parse(await res.json())
}

export async function saveProgress(userId: string, slug: string, n: number) {
  const res = await fetch(`${API}/api/progress`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ userId, slug, lesson: n }),
  })
  if (!res.ok) throw new Error('progress failed')
}

export async function saveFeedback(data: object) {
  const res = await fetch(`${API}/api/feedback`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('feedback failed')
}
