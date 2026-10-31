import { z } from 'zod'

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, 'Give the course a title of 3 letters or more'),
  price: z
    .number({ error: 'Type a price, or 0 for free' })
    .min(0, 'A price cannot be below 0'),
  lessons: z
    .array(
      z.object({
        title: z.string().min(1, 'Name this lesson'),
        minutes: z
          .number({ error: 'Type the minutes' })
          .min(1, 'At least 1 minute'),
      }),
    )
    .min(1, 'Add at least one lesson'),
})

export type CourseValues = z.infer<typeof courseSchema>
