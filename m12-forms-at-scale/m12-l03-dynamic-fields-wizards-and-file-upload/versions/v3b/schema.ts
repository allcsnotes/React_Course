import { z } from 'zod'

const MB = 1024 * 1024
const TYPES = ['image/png', 'image/jpeg']

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
  thumbnail: z
    .instanceof(FileList, { error: 'Pick a picture' })
    .refine(list => list.length === 1, 'Pick a picture')
    .refine(
      list => !list[0] || TYPES.includes(list[0].type),
      'Pick a PNG or a JPEG',
    )
    .refine(
      list => !list[0] || list[0].size <= 10 * MB,
      'That picture is over 10 megabytes',
    ),
})

export type CourseValues = z.infer<typeof courseSchema>
