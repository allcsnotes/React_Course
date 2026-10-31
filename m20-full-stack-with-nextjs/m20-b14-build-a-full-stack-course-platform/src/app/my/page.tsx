import { Suspense } from 'react'
import Link from 'next/link'
import Progress from '@/components/Progress'
import { myCourses } from '@/lib/learn'
import { requireUser } from '@/lib/session'

async function MyList() {
  const user = await requireUser()
  const rows = await myCourses(user.id)
  if (rows.length === 0) return <p className="muted">No courses yet.</p>
  return (
    <div className="stack">
      {rows.map((r) => (
        <Link key={r.slug} href={`/courses/${r.slug}`} className="card pad">
          <h3>{r.title}</h3>
          <Progress done={r.done} total={r.total} />
        </Link>
      ))}
    </div>
  )
}

export default function MyPage() {
  return (
    <>
      <h1>My courses</h1>
      <Suspense fallback={<p className="muted">Loading…</p>}>
        <MyList />
      </Suspense>
    </>
  )
}
