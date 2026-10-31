import Link from 'next/link'
import { auth } from '@/auth'
import { enroll, markDone } from '@/app/actions'
import { doneLessonIds, isEnrolled } from '@/lib/learn'
import Progress from './Progress'

type Lesson = { id: number; title: string }

export default async function Lessons({
  courseId,
  lessons,
}: {
  courseId: number
  lessons: Lesson[]
}) {
  const session = await auth()
  if (!session?.user) {
    return (
      <Link href="/login" className="btn">
        Sign in to enroll
      </Link>
    )
  }
  const userId = Number(session.user.id)
  if (!(await isEnrolled(userId, courseId))) {
    return (
      <form action={enroll.bind(null, courseId)}>
        <button className="btn">Enroll</button>
      </form>
    )
  }
  const done = await doneLessonIds(userId, courseId)
  return (
    <>
      <Progress done={done.length} total={lessons.length} />
      <ol className="lessons">
        {lessons.map((l) => (
          <li key={l.id}>
            <span>{l.title}</span>
            {done.includes(l.id) ? (
              <b className="done">Done</b>
            ) : (
              <form action={markDone.bind(null, l.id)}>
                <button className="mini">Mark done</button>
              </form>
            )}
          </li>
        ))}
      </ol>
    </>
  )
}
