export type Course = { slug: string; title: string; teacher: string; price: number }

export const courses: Course[] = [
  { slug: 'react-beginners', title: 'React for Beginners', teacher: 'Meera', price: 499 },
  { slug: 'python-zero', title: 'Python from Zero', teacher: 'Meera', price: 399 },
  { slug: 'sql-weekend', title: 'SQL in a Weekend', teacher: 'Meera', price: 349 },
]
