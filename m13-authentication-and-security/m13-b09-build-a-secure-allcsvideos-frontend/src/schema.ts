import { z } from 'zod'

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  role: z.enum(['student', 'instructor', 'admin']),
})
export type User = z.infer<typeof UserSchema>
export type Role = User['role']

export const SessionSchema = z.object({
  accessToken: z.string(),
  user: UserSchema,
})

export const CourseSchema = z.object({
  slug: z.string(),
  title: z.string(),
  teacher: z.string(),
  lessonCount: z.number(),
  completedCount: z.number(),
})
export type Course = z.infer<typeof CourseSchema>

export const CoursesSchema = z.array(CourseSchema)
export const UsersSchema = z.array(UserSchema)
