import { z } from 'zod'

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
})

export type Course = z.infer<typeof CourseSchema>
