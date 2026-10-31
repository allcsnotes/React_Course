import { z } from 'zod'

export const MyCourseSchema = z.object({
  slug: z.string(),
  title: z.string(),
  teacher: z.string(),
  lessonCount: z.number(),
  completedCount: z.number(),
})
export const MyCoursesSchema = z.array(MyCourseSchema)

export type MyCourse = z.infer<typeof MyCourseSchema>
