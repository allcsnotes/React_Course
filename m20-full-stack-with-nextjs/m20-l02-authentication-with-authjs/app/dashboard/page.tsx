import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { enrollments, users } from '@/db/schema'

export default async function Dashboard() {
  const session = await auth()
  if (!session) redirect('/login')
  const mine = await db
    .select({ id: enrollments.id, course: enrollments.course })
    .from(enrollments)
    .innerJoin(users, eq(users.id, enrollments.userId))
    .where(eq(users.email, session.user.email!))
  return (
    <div className="card">
      <h1>Welcome, {session.user.name}<span className="chip">{session.user.role}</span></h1>
      <h2>My courses ({mine.length})</h2>
      {mine.length === 0 && <p className="hint">Nothing yet.</p>}
      {mine.map(e => <div className="row" key={e.id}><span>{e.course}</span></div>)}
    </div>
  )
}
