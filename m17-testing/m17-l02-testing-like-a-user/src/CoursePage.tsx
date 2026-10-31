import { useEffect, useState } from 'react'
import { enroll, loadLessons, type Lesson } from './api.ts'

export function CoursePage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [saved, setSaved] = useState(false)
  const [lessons, setLessons] = useState<Lesson[] | null>(null)

  useEffect(() => {
    loadLessons().then(setLessons)
  }, [])

  async function join(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    await enroll(email)
    setStatus('done')
  }

  return (
    <main>
      <h1>Python from Zero</h1>
      <button aria-pressed={saved} onClick={() => setSaved(!saved)}>
        {saved ? 'Saved' : 'Save course'}
      </button>
      <form onSubmit={join}>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <button className="btn" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Enrolling…' : 'Enroll now'}
        </button>
      </form>
      <div className="slot">{status === 'done' && <p role="status">You are enrolled, {email}</p>}</div>
      <h2>Lessons</h2>
      {lessons === null ? (
        <p>Loading lessons…</p>
      ) : (
        <ul>
          {lessons.map((l) => (
            <li key={l.id}>{l.title}</li>
          ))}
        </ul>
      )}
    </main>
  )
}
