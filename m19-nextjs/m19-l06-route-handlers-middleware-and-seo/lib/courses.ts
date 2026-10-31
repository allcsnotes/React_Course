export type Course = { slug: string; title: string; blurb: string; price: number }

export const courses: Course[] = [
  { slug: 'react-for-beginners', title: 'React for Beginners', blurb: 'Build your first React app, from zero.', price: 499 },
  { slug: 'sql-in-two-weeks', title: 'SQL in Two Weeks', blurb: 'Ask a database real questions.', price: 399 },
  { slug: 'python-from-zero', title: 'Python from Zero', blurb: 'Your first program to a real project.', price: 599 },
  { slug: 'system-design-basics', title: 'System Design Basics', blurb: 'How big websites stay up.', price: 699 },
]

export const findCourse = (slug: string) => courses.find((c) => c.slug === slug)
