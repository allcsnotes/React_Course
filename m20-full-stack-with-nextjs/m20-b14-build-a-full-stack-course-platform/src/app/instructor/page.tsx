import { Suspense } from 'react'
import { instructorStats } from '@/lib/learn'
import { percent } from '@/lib/progress'
import { requireInstructor } from '@/lib/session'

async function Stats() {
  const me = await requireInstructor()
  const rows = await instructorStats(me.id)
  return (
    <table>
      <thead>
        <tr><th>Course</th><th>Students</th><th>Average progress</th></tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.title}>
            <td>{r.title}</td>
            <td>{r.students}</td>
            <td>{percent(r.done, r.students * r.lessons)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function InstructorPage() {
  return (
    <>
      <h1>Instructor dashboard</h1>
      <Suspense fallback={<p className="muted">Loading…</p>}>
        <Stats />
      </Suspense>
    </>
  )
}
