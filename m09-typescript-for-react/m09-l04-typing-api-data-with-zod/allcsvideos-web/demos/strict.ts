import { z } from 'zod'

const Mini = z.strictObject({ slug: z.string() })
const result = Mini.safeParse({ slug: 'react', badge: 'new' })

console.log(result.success)
if (!result.success) console.log(z.prettifyError(result.error))
