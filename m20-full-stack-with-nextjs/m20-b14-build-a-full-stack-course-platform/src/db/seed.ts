import bcrypt from 'bcryptjs'
import { sql } from 'drizzle-orm'
import { db } from './index'
import { courses, enrollments, lessonProgress, lessons, users } from './schema'

const PASSWORD = 'demo-password-1' // fake, for this local demo only

async function main() {
  await db.execute(sql`truncate users, courses, lessons, enrollments, lesson_progress restart identity cascade`)
  const user = async (name: string, role = 'student') => ({
    email: `${name.toLowerCase()}@allcsvideos.test`,
    name,
    role,
    passwordHash: await bcrypt.hash(PASSWORD, 10),
  })
  const [meera, lukas, priya] = await db
    .insert(users)
    .values([
      await user('Meera', 'instructor'),
      await user('Lukas'),
      await user('Priya'),
    ])
    .returning()
  const made = await db
    .insert(courses)
    .values([
      { slug: 'react-for-beginners', title: 'React for Beginners', level: 'beginner', summary: 'Components, props and state, one small step at a time.', instructorId: meera.id },
      { slug: 'nextjs-full-stack', title: 'Full-Stack with Next.js', level: 'intermediate', summary: 'A database, sign-in and server actions in one app.', instructorId: meera.id },
      { slug: 'typescript-basics', title: 'TypeScript Basics', level: 'beginner', summary: 'Types that catch your mistakes before the browser does.', instructorId: meera.id },
    ])
    .returning()
  const titles: Record<string, string[]> = {
    'react-for-beginners': ['What React is', 'Your first component', 'Props', 'State', 'Lists and keys'],
    'nextjs-full-stack': ['The App Router', 'A database', 'Sign in', 'Server actions'],
    'typescript-basics': ['Why types', 'Props and state', 'Zod'],
  }
  for (const c of made) {
    await db.insert(lessons).values(
      titles[c.slug].map((title, i) => ({ courseId: c.id, position: i + 1, title })),
    )
  }
  await db.insert(enrollments).values([
    { userId: lukas.id, courseId: made[0].id },
    { userId: priya.id, courseId: made[0].id },
    { userId: priya.id, courseId: made[1].id },
  ])
  await db.insert(lessonProgress).values([
    { userId: lukas.id, lessonId: 1 },
    { userId: lukas.id, lessonId: 2 },
    { userId: priya.id, lessonId: 1 },
    { userId: priya.id, lessonId: 2 },
    { userId: priya.id, lessonId: 3 },
    { userId: priya.id, lessonId: 6 },
  ])
  console.log('seeded: 3 users, 3 courses, 12 lessons')
  process.exit(0)
}
main()
