export type Course = { id: number; title: string; level: 'Beginner' | 'Intermediate'; price: number }

export const COURSES: Course[] = [
  { id: 1, title: 'React for Beginners', level: 'Beginner', price: 499 },
  { id: 2, title: 'SQL in Two Weeks', level: 'Beginner', price: 399 },
  { id: 3, title: 'Docker for Developers', level: 'Intermediate', price: 599 },
  { id: 4, title: 'System Design', level: 'Intermediate', price: 999 },
  { id: 5, title: 'Python from Zero', level: 'Beginner', price: 349 },
  { id: 6, title: 'Testing React Apps', level: 'Intermediate', price: 549 },
  { id: 7, title: 'Git and GitHub', level: 'Beginner', price: 299 },
  { id: 8, title: 'FastAPI in Practice', level: 'Intermediate', price: 649 },
]

export type SortDir = 'none' | 'asc' | 'desc'

// Pure: filter by title (any case, spaces trimmed), then sort by price. Never changes the input array.
export function filterCourses(list: Course[], query: string, dir: SortDir): Course[] {
  const q = query.trim().toLowerCase()
  const found = list.filter((c) => c.title.toLowerCase().includes(q))
  if (dir === 'none') return found
  return found.toSorted((a, b) => (dir === 'asc' ? a.price - b.price : b.price - a.price))
}
