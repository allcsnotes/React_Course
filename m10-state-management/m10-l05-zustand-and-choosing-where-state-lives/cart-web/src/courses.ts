export type Course = { slug: string; title: string; price: number }

export const COURSES: Course[] = [
  { slug: 'react-for-beginners', title: 'React for Beginners', price: 499 },
  { slug: 'sql-in-two-weeks', title: 'SQL in Two Weeks', price: 399 },
  { slug: 'docker-for-developers', title: 'Docker for Developers', price: 599 },
]

export const priceOf = (slug: string) => COURSES.find((c) => c.slug === slug)?.price ?? 0

export const totalOf = (items: string[], coupon: string | null) => {
  const sum = items.reduce((total, slug) => total + priceOf(slug), 0)
  return coupon === 'SAVE10' ? Math.round(sum * 0.9) : sum
}
