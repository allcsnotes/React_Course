import { z } from 'zod'

const CourseSchema = z.object({
  slug: z.string(),
  title: z.string(),
  teacher: z.string(),
  level: z.string(),
  price: z.number(),
  free: z.boolean(),
  lessonCount: z.number(),
})

const PageSchema = z.object({
  items: z.array(CourseSchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPages: z.number(),
  nextPage: z.number().nullable(),
})

export type Course = z.infer<typeof CourseSchema>
export type CoursePage = z.infer<typeof PageSchema>

async function getJson<T>(url: string, schema: z.ZodType<T>) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Server answered ${res.status}`)
  return schema.parse(await res.json())
}

export const getAllCourses = () =>
  getJson('/api/courses', z.array(CourseSchema))
export const getCoursePage = (page: number) =>
  getJson(`/api/courses?page=${page}&pageSize=6`, PageSchema)
