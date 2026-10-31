import { useNavigate, useSearchParams } from 'react-router'
import { useAuth } from './auth'
import type { User } from './auth'
import { useGet } from './api'
import type { State } from './api'
import type { Role } from './roles'

type Course = { slug: string; title: string; teacher: string; students: number }
const FEATURED = ['React for Beginners', 'Python from Zero']
type Row = User & { id: number; email: string }

function Problem({ s }: { s: Extract<State<unknown>, { status: 'error' }> }) {
  return <p className="bad">The server answered {s.code}: {s.message}</p>
}

export function Home() {
  const { user } = useAuth()
  return (
    <>
      <h1>Welcome to allcsvideos</h1>
      <p className="note">
        {user ? `Hi ${user.name}. You are signed in as ${user.role}.` : 'Sign in to see your courses.'}
      </p>
      <ul className="grid">
        {FEATURED.map(c => <li className="card" key={c}><h2>{c}</h2></li>)}
      </ul>
    </>
  )
}

export function Login() {
  const { signIn } = useAuth()
  const go = useNavigate()
  const next = useSearchParams()[0].get('next') ?? '/'
  const as = (name: string, role: string) => (
    <button className="big" onClick={async () => { await signIn(name.toLowerCase() + '@example.com'); go(next) }}>
      Sign in as {name} <b className={role}>{role}</b>
    </button>
  )
  return (
    <>
      <h1>Sign in</h1>
      <p className="note">Practice sign-in: no password. Real login is lesson one.</p>
      <div className="stack">{as('Lukas', 'student')}{as('Meera', 'instructor')}{as('Asha', 'admin')}</div>
    </>
  )
}

function List({ path, title }: { path: string; title: string }) {
  const s = useGet<Course[]>(path)
  if (s.status === 'loading') return <p className="note">Loading...</p>
  if (s.status === 'error') return <><h1>{title}</h1><Problem s={s} /></>
  return (
    <>
      <h1>{title}</h1>
      <ul className="grid">
        {s.data.map(c => (
          <li className="card" key={c.slug}><h2>{c.title}</h2><p>{c.teacher} · {c.students} students</p></li>
        ))}
      </ul>
    </>
  )
}

export const MyCourses = () => <List path="/api/my-courses" title="My courses" />
export const Studio = () => <List path="/api/studio/courses" title="Instructor studio" />

export function Admin() {
  const s = useGet<Row[]>('/api/admin/users')
  if (s.status === 'loading') return <p className="note">Loading...</p>
  if (s.status === 'error') return <><h1>Admin</h1><Problem s={s} /></>
  return (
    <>
      <h1>Admin: all users</h1>
      <ul className="grid">
        {s.data.map(u => (
          <li className="card" key={u.id}><h2>{u.name} <b className={u.role}>{u.role}</b></h2><p>{u.email}</p></li>
        ))}
      </ul>
    </>
  )
}

export function Forbidden({ role }: { role: Role }) {
  return (
    <>
      <h1>403: not for your role</h1>
      <p className="bad">You are signed in as {role}. This page is not for {role}.</p>
    </>
  )
}
