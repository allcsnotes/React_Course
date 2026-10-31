export type Course = { slug: string; title: string; teacher: string }
export type Lesson = { id: number; title: string; minutes: number }
export type Review = { id: number; author: { name: string }; stars: number; text: string }

const API = 'http://localhost:8145'
export const COURSE = '/api/courses/react-for-beginners'
export const LESSONS = COURSE + '/lessons'
export const REVIEWS = COURSE + '/reviews'

export async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(API + path)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

// one promise per address, kept OUTSIDE the components
const cache = new Map<string, Promise<unknown>>()

export function load<T>(path: string): Promise<T> {
  if (!cache.has(path)) cache.set(path, getJson<T>(path))
  return cache.get(path) as Promise<T>
}

export function forget(path: string) {
  cache.delete(path)
}
