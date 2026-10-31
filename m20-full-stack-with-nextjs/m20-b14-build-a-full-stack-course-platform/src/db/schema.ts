import {
  type AnyPgColumn, integer, pgTable, primaryKey, serial, text, timestamp,
} from 'drizzle-orm/pg-core'

const ref = (name: string, to: () => AnyPgColumn) =>
  integer(name).notNull().references(to)

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('student'),
})

export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  level: text('level').notNull(),
  summary: text('summary').notNull(),
  instructorId: ref('instructor_id', () => users.id),
})

export const lessons = pgTable('lessons', {
  id: serial('id').primaryKey(),
  courseId: ref('course_id', () => courses.id),
  position: integer('position').notNull(),
  title: text('title').notNull(),
})

export const enrollments = pgTable(
  'enrollments',
  {
    userId: ref('user_id', () => users.id),
    courseId: ref('course_id', () => courses.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.courseId] })],
)

export const lessonProgress = pgTable(
  'lesson_progress',
  {
    userId: ref('user_id', () => users.id),
    lessonId: ref('lesson_id', () => lessons.id),
    doneAt: timestamp('done_at').notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.lessonId] })],
)
