import { CoursesSchema } from './schema'

export function first(json: unknown) {
  const result = CoursesSchema.safeParse(json)
  if (!result.success) return 'bad'
  return result.data[0].title
}
