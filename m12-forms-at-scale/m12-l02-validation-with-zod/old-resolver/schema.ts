import { z } from 'zod'

export const courseSchema = z
  .object({
    title: z.string().trim().min(5, 'Use at least 5 letters'),
    price: z
      .number({ error: 'Enter the price as a number' })
      .min(0, 'The price cannot be below zero'),
    level: z.enum(['beginner', 'intermediate', 'advanced'], {
      error: 'Pick a level',
    }),
    description: z.string().trim().max(300, 'At most 300 letters'),
  })
  .refine(c => c.price === 0 || c.description.length >= 20, {
    error: 'Paid courses need a description of 20+ letters',
    path: ['description'],
  })

export type CourseValues = z.infer<typeof courseSchema>
