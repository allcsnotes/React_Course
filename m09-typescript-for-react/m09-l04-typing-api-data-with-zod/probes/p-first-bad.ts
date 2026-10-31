import { CoursesSchema } from './schema'

export function first(json: unknown) {
  const result = CoursesSchema.safeParse(json)
  return result.data[0].title
}
