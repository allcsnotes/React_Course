import { cacheLife } from 'next/cache'
import { asc, eq } from 'drizzle-orm'
import { db } from '@/db'
import { courses, lessons, users } from '@/db/schema'

export async function getCourse(slug: string) {
  'use cache'
  cacheLife('hours')
  const course = await db.query.courses.findFirst({
    where: eq(courses.slug, slug),
  })
  if (!course) return null
  const teacher = await db.query.users.findFirst({
    where: eq(users.id, course.instructorId),
  })
  const list = await db
    .select({ id: lessons.id, title: lessons.title })
    .from(lessons)
    .where(eq(lessons.courseId, course.id))
    .orderBy(asc(lessons.position))
  return { ...course, teacher: teacher?.name ?? '', lessons: list }
}

export async function getSlugs() {
  const rows = await db.select({ slug: courses.slug }).from(courses)
  return rows.map((r) => r.slug)
}
