import type { CourseDetail, MyCourse } from './schema.ts'

export const markDone = (course: CourseDetail, id: number): CourseDetail => ({
  ...course,
  lessons: course.lessons.map((l) => (l.id === id ? { ...l, done: true } : l)),
})

export const addOne = (courses: MyCourse[], slug: string): MyCourse[] =>
  courses.map((c) =>
    c.slug === slug ? { ...c, completedCount: c.completedCount + 1 } : c,
  )
