import { Suspense } from 'react'
import Link from 'next/link'
import { getCourses, getProgress } from '@/lib/api'
import { percent } from '@/lib/progress'
import { requireUser } from '@/lib/session'

async function Mine() {
  const user = await requireUser()
  const [courses, progress] = await Promise.all([getCourses(), getProgress(user.id)])
  const started = courses.filter((c) => progress[c.slug]?.length)
  return (
    <>
      <h1>Welcome, {user.name}</h1>
      {started.length === 0 ? <p className="muted">You have not started a course yet.</p> : (
        <ul className="grid">
          {started.map((c) => (
            <li key={c.slug} className="card">
              <h3><Link href={`/courses/${c.slug}`}>{c.title}</Link></h3>
              <p className="price">{percent(progress[c.slug].length, c.lessonCount)}% done</p>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default function MyPage() {
  return (
    <Suspense fallback={<p className="muted">Loading…</p>}>
      <Mine />
    </Suspense>
  )
}
