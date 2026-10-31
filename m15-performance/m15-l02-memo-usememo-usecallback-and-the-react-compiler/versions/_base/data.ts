export type Course = { slug: string; title: string; teacher: string; price: number }

export const courses: Course[] = [
  { slug: 'react-beginners', title: 'React for Beginners', teacher: 'Meera', price: 499 },
  { slug: 'python-zero', title: 'Python from Zero', teacher: 'Meera', price: 399 },
  { slug: 'sql-weekend', title: 'SQL in a Weekend', teacher: 'Meera', price: 349 },
]

// 200,000 courses for the sorting test: the three real ones plus 199,997 more, all dearer
export const allCourses: Course[] = [
  ...courses,
  ...Array.from({ length: 199997 }, (_, i) => ({
    slug: `course-${i}`,
    title: `Course number ${i + 1}`,
    teacher: 'Meera',
    price: 500 + ((i * 7919) % 4500),
  })),
]
