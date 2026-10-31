import type { Course, Lesson } from './types'

export const courses: Course[] = [
  { id: 1, title: 'React for Beginners', teacher: 'Meera', lessons: 12, price: 499, free: false },
  { id: 2, title: 'Python from Zero', teacher: 'Meera', lessons: 20, price: 0, free: true },
  { id: 3, title: 'System Design', teacher: 'Rahul', lessons: 25, price: 999, free: false },
  { id: 4, title: 'DevOps Basics', teacher: 'Asha', lessons: 15, price: 0, free: true },
]

export const lessons: Lesson[] = [
  { id: 1, title: 'What is a component?', minutes: 8 },
  { id: 2, title: 'Props in practice', minutes: 11 },
  { id: 3, title: 'State and events', minutes: 14 },
  { id: 4, title: 'Lists and keys', minutes: 9 },
]
