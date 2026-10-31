import { z } from 'zod'

const plain = z.object({
  title: z.string().min(5),
  price: z.number(),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
})

const form = { title: 'Go', price: NaN, level: 'expert' }
const result = plain.safeParse(form)

if (!result.success) {
  for (const issue of result.error.issues) {
    console.log(issue.path.join('.') + ':', issue.message)
  }
}
