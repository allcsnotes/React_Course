import { z } from 'zod'

export const CourseSchema = z.object({
  slug: z.string(),
  title: z.string(),
  teacher: z.string(),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  price: z.number(),
  free: z.boolean(),
  lessonCount: z.number(),
})

export const CoursesSchema = z.array(CourseSchema)

export type Course = z.infer<typeof CourseSchema>
