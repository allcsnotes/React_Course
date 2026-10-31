import { and, eq, sql } from 'drizzle-orm'
import { db } from '@/db'
import { courses, enrollments, lessonProgress, lessons } from '@/db/schema'

export async function enrollUser(userId: number, courseId: number) {
  await db
    .insert(enrollments)
    .values({ userId, courseId })
    .onConflictDoNothing()
}

export async function completeLesson(userId: number, lessonId: number) {
  const lesson = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
  })
  if (!lesson) return 'no such lesson'
  const enrolled = await db.query.enrollments.findFirst({
    where: and(
      eq(enrollments.userId, userId),
      eq(enrollments.courseId, lesson.courseId),
    ),
  })
  if (!enrolled) return 'not enrolled'
  await db
    .insert(lessonProgress)
    .values({ userId, lessonId })
    .onConflictDoNothing()
  return 'ok'
}

export async function myCourses(userId: number) {
  const rows = await db.execute<{
    slug: string
    title: string
    total: number
    done: number
  }>(sql`
    select c.slug, c.title,
      (select count(*) from lessons l where l.course_id = c.id)::int as total,
      (select count(*) from lesson_progress p
         join lessons l on l.id = p.lesson_id
        where l.course_id = c.id and p.user_id = ${userId})::int as done
    from enrollments e join courses c on c.id = e.course_id
    where e.user_id = ${userId} order by e.created_at`)
  return rows.rows
}

export async function doneLessonIds(userId: number, courseId: number) {
  const rows = await db
    .select({ id: lessonProgress.lessonId })
    .from(lessonProgress)
    .innerJoin(lessons, eq(lessons.id, lessonProgress.lessonId))
    .where(
      and(eq(lessonProgress.userId, userId), eq(lessons.courseId, courseId)),
    )
  return rows.map((r) => r.id)
}

export async function isEnrolled(userId: number, courseId: number) {
  const row = await db.query.enrollments.findFirst({
    where: and(
      eq(enrollments.userId, userId),
      eq(enrollments.courseId, courseId),
    ),
  })
  return !!row
}

export async function instructorStats(instructorId: number) {
  const rows = await db.execute<{
    title: string
    students: number
    lessons: number
    done: number
  }>(sql`
    select c.title,
      (select count(*) from enrollments e
        where e.course_id = c.id)::int as students,
      (select count(*) from lessons l
        where l.course_id = c.id)::int as lessons,
      (select count(*) from lesson_progress p
         join lessons l on l.id = p.lesson_id
        where l.course_id = c.id)::int as done
    from courses c where c.instructor_id = ${instructorId}
    order by c.id`)
  return rows.rows
}

export async function allCourses() {
  return db.select().from(courses).orderBy(courses.id)
}
