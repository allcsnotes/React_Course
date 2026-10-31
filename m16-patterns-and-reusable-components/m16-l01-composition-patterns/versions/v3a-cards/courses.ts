export type Course = { slug: string; title: string; teacher: string; price: number }

export const courses: Course[] = [
  { slug: 'react', title: 'React for Beginners', teacher: 'Meera', price: 499 },
  { slug: 'python', title: 'Python from Zero', teacher: 'Meera', price: 0 },
  { slug: 'devops', title: 'DevOps Basics', teacher: 'Asha', price: 0 },
  { slug: 'sql', title: 'SQL in Two Weeks', teacher: 'Asha', price: 399 },
]

export const price = (c: Course) => (c.price ? 'Rs ' + c.price : 'Free')
