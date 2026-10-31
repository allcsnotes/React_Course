import { useState } from 'react'
import { joinWaitlist } from './api'

export function Waitlist() {
  const [email, setEmail] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setError('')
    try {
      setDone(await joinWaitlist(email))
      setEmail('')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <label>
        Email
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <button disabled={pending}>{pending ? 'Joining…' : 'Join'}</button>
      {error && <p className="msg error">{error}</p>}
      {done && <p className="msg ok">{done} is on the list</p>}
    </form>
  )
}
