import { z } from 'zod'

export const Course = z.object({
  slug: z.string(),
  title: z.string(),
  teacher: z.string(),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  price: z.number(),
  free: z.boolean(),
  summary: z.string(),
  lessonCount: z.number(),
})
export const CourseDetail = Course.extend({ lessons: z.array(z.string()) })
export const Progress = z.record(z.string(), z.array(z.number()))
export type Course = z.infer<typeof Course>

export const feedbackSchema = z.object({
  email: z.email('Enter a valid email'),
  rating: z.number().int().min(1, 'Pick a rating from 1 to 5').max(5),
  message: z.string().trim().min(10, 'Write at least 10 characters'),
})
export type Feedback = z.infer<typeof feedbackSchema>
