import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { login, logout, whoAmI, loadCourses } from './auth'

type User = { name: string; role: string }
type Course = { id: number; title: string }

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    whoAmI().then(u => { setUser(u); setReady(true) })
  }, [])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    try {
      await login({
        email: String(f.get('email')),
        password: String(f.get('password')),
      })
      setUser(await whoAmI())
      setError('')
    } catch (err) {
      setError((err as Error).message)
    }
  }

  if (!ready) return <p className="note">Loading...</p>
  if (!user) return (
    <main>
      <h1>allcsvideos</h1>
      <form onSubmit={onSubmit}>
        <label>Email <input name="email" defaultValue="lukas@example.com" /></label>
        <label>Password <input name="password" type="password" defaultValue="pass1234" /></label>
        <button>Sign in</button>
        {error && <p className="bad">{error}</p>}
      </form>
    </main>
  )
  return (
    <main>
      <h1>allcsvideos</h1>
      <p className="hello">Welcome, <b>{user.name}</b> <span className="chip">{user.role}</span></p>
      <div className="row">
        <button onClick={() => loadCourses().then(setCourses).catch(e => setError(e.message))}>Load my courses</button>
        <button className="ghost" onClick={async () => { await logout(); setUser(null); setCourses([]) }}>Sign out</button>
      </div>
      {error && <p className="bad">{error}</p>}
      <ul className="list">{courses.map(c => <li key={c.id}>{c.title}</li>)}</ul>
    </main>
  )
}
