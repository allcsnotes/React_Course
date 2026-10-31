import { z } from 'zod'

export const LessonSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Give the lesson a title'),
  minutes: z
    .number({ error: 'Enter the minutes' })
    .int()
    .min(1, 'At least 1 minute'),
})

export const CourseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, 'Title needs at least 5 letters'),
  summary: z
    .string()
    .trim()
    .min(20, 'Summary needs at least 20 letters'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  price: z
    .number({ error: 'Enter a price' })
    .min(0, 'No negative prices'),
  thumbnail: z.string().min(1, 'Add a thumbnail'),
  lessons: z
    .array(LessonSchema)
    .min(1, 'Add at least one lesson'),
})

export const LoadedSchema = CourseSchema.extend({
  thumbnail: z.string(),
})

export type Course = z.infer<typeof CourseSchema>
