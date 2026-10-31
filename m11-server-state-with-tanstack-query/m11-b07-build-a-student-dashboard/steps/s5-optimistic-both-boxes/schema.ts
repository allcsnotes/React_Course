import { z } from 'zod'

export const MyCourseSchema = z.object({
  slug: z.string(),
  title: z.string(),
  teacher: z.string(),
  lessonCount: z.number(),
  completedCount: z.number(),
})
export const MyCoursesSchema = z.array(MyCourseSchema)

export const LessonSchema = z.object({
  id: z.number(),
  title: z.string(),
  minutes: z.number(),
  done: z.boolean(),
})
export const CourseDetailSchema = z.object({
  slug: z.string(),
  title: z.string(),
  teacher: z.string(),
  lessons: z.array(LessonSchema),
})
export const DoneSchema = z.object({
  lessonId: z.number(),
  done: z.boolean(),
})

export type MyCourse = z.infer<typeof MyCourseSchema>
export type CourseDetail = z.infer<typeof CourseDetailSchema>
