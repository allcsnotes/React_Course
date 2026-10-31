import { forbidden, redirect } from 'next/navigation'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { users } from '@/db/schema'

export default async function Admin() {
  const session = await auth()
  if (!session) redirect('/login')
  if (session.user.role !== 'admin') forbidden()
  const all = await db.select().from(users)
  return (
    <div className="card">
      <h1>Admin</h1>
      <h2>Everybody on the site ({all.length})</h2>
      {all.map(u => <div className="row" key={u.id}><b>{u.name}</b><span>{u.email} · {u.role}</span></div>)}
    </div>
  )
}
