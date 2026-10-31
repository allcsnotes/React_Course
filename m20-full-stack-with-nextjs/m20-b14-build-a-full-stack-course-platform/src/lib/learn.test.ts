import { sql } from 'drizzle-orm'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '@/db'
import { courses, lessons, users } from '@/db/schema'
import {
  completeLesson,
  enrollUser,
  instructorStats,
  myCourses,
} from './learn'

beforeEach(async () => {
  await db.execute(
    sql`truncate users, courses, lessons, enrollments, lesson_progress restart identity cascade`,
  )
  await db.insert(users).values([
    { email: 'm@x.test', name: 'M', passwordHash: 'x', role: 'instructor' },
    { email: 'l@x.test', name: 'L', passwordHash: 'x' },
  ])
  await db.insert(courses).values({
    slug: 'c', title: 'C', level: 'beginner', summary: 's', instructorId: 1,
  })
  await db.insert(lessons).values([
    { courseId: 1, position: 1, title: 'one' },
    { courseId: 1, position: 2, title: 'two' },
  ])
})

describe('learning flow', () => {
  it('enrolling twice keeps one row', async () => {
    await enrollUser(2, 1)
    await enrollUser(2, 1)
    expect((await myCourses(2)).length).toBe(1)
  })

  it('refuses a lesson from a course you are not in', async () => {
    expect(await completeLesson(2, 1)).toBe('not enrolled')
    expect(await completeLesson(2, 99)).toBe('no such lesson')
    await enrollUser(2, 1)
    expect((await myCourses(2))[0].done).toBe(0)
  })

  it('counts progress once per lesson', async () => {
    await enrollUser(2, 1)
    expect(await completeLesson(2, 1)).toBe('ok')
    expect(await completeLesson(2, 1)).toBe('ok')
    const [row] = await myCourses(2)
    expect([row.done, row.total]).toEqual([1, 2])
  })

  it('shows the instructor students and progress', async () => {
    await enrollUser(2, 1)
    await completeLesson(2, 2)
    expect(await instructorStats(1)).toEqual([
      { title: 'C', students: 1, lessons: 2, done: 1 },
    ])
  })
})
