import { z } from 'zod'

const sent = { slug: 'react', price: -5, badge: 'new' }

const Loose = z.object({ slug: z.string(), price: z.number() })
console.log(Loose.parse(sent))

const Safer = z.object({ slug: z.string(), price: z.number().min(0) })
console.log(Safer.safeParse(sent).success)
